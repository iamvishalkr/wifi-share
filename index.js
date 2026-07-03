const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const os = require("os");
const path = require("path");
const cors = require("cors");
const { spawn, exec } = require("child_process");
const net = require("node:net");

const uploadRoutes = require("./routes/upload.routes.js");
const downloadRoutes = require("./routes/download.routes.js");
const { cleanUp } = require("./cleanup.js");

function getLocalIpv4() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}
let assignedPort = null;
function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.listen(0, () => {
      const address = server.address();
      // Ensure address is an object and extract port
      const port = typeof address === "string" ? 0 : address?.port;

      server.close(() => {
        if (port) resolve(port);
        else reject(new Error("Failed to get port"));
      });
    });

    server.on("error", (err) => reject(err));
  });
}

const devicesSet = new Set([]);

const PORT = 0; //53314;
const localIp = getLocalIpv4();

const app = express();
const socketServer = http.createServer(app);

app.use(cors());
app.use(express.json());
// File upload route
app.use("/upload-file", uploadRoutes);
app.use("/download", downloadRoutes);

app.use(express.static(path.join(process.cwd(), "public")));

const server = socketServer.listen(PORT, localIp, () => {
  // 1. Get the address object from the server instance
  const address = server.address();

  // 2. Extract the port securely (address is an object when listening on a port)
  assignedPort = address && typeof address !== "string" ? address.port : PORT;

  // 3. Log your URL
  console.log(`Server is listening to url: http://${localIp}:${assignedPort}`);
  if (localIp === "127.0.0.1") {
    console.error("Couldn't Detect Wifi Connection! Try again");
  } else {
    setTimeout(() => {
      openInEdge(localIp, assignedPort);
    }, 1000);
  }
  cleanUp();
});

const io = new Server(server, { cors: { origin: "*" }, serveClient: false });

io.on("connection", (socket) => {
  // Get the user agent string
  const userAgent = socket.handshake.headers["user-agent"];

  // Check if it matches mobile signatures
  const isMobile = /Mobi|Android/i.test(userAgent);
  const deviceType = isMobile ? "PH_" : "PC_";
  console.log("deviceConnected", { id: socket.id, deviceType });
  devicesSet.add(deviceType + socket.id);
  io.emit("new_device", Array.from(devicesSet));

  // 2. Listen for messages from ANY device and broadcast them to ALL devices
  socket.on("my_files", (msg) => {
    console.log("received from client", msg);
    io.emit("my_files", msg);
  });

  socket.on("my_messages", (msg) => {
    console.log("received from client my msg", msg);
    io.emit("my_messages", msg);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Device disconnected: ${socket.id}. Reason: ${reason}`);
    devicesSet.delete(deviceType + socket.id);
    io.emit("new_device", Array.from(devicesSet));
  });
});

const openInEdge = (localIp, PORT) => {
  if (process.env.NODE_ENV !== "production") {
    return false;
  }
  const tempProfilePath = path.join(process.cwd(), "edge_app_profile");
  const edgePath =
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

  // Fallback: Helper function to force kill the process tree on Windows
  function killBrowserTree() {
    if (browserProcess && browserProcess.pid) {
      // /T kills the specified process and any child processes started by it
      // /F specifies to forcefully terminate the process(es)
      exec(`taskkill /pid ${browserProcess.pid} /T /F`, (err) => {
        if (!err)
          console.log("Successfully wiped all background Edge instances.");
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  }

  const browserProcess = spawn(edgePath, [
    `--app=http://${localIp}:${PORT}`,
    `--user-data-dir=${tempProfilePath}`,
  ]);

  // True launch errors trigger the "error" event, not the "stderr" stream.
  browserProcess.on("error", (err) => {
    if (err.code === "ENOENT") {
      console.error("Edge Browser Not found at the specified path!");
    } else {
      console.error("Failed to start Edge process:", err.message);
    }
  });

  browserProcess.on("close", (code) => {
    console.log(`browser window closed... shutting down server...`);
    killBrowserTree();
  });

  // 2. Handle when YOU close the server terminal using Ctrl+C
  process.on("SIGINT", () => {
    console.log("\nTerminal interrupted! Cleaning up browser tree...");
    killBrowserTree();
  });

  //   if server crashes, kill the browser:
  process.on("exit", () => {
    browserProcess.kill();
  });
};

// in dev mode a brige app with fixed port is required for port discovery:
if (process.env.NODE_ENV === "development") {
  const bridgeApp = express();

  // Allow frontend to bypass CORS in dev
  bridgeApp.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

  bridgeApp.get("/get-ws-port", (req, res) => {
    res.json({ port: assignedPort });
  });

  bridgeApp.listen(53314, () => console.log("Port discovery active on 53314"));
}
