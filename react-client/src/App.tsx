import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Messages from "./pages/Messages";
import FilesPage from "./pages/FilesPage";
import Layout from "./Layout";
import { useMyContext, type FileInfoType } from "./provider/MyContext";
import { useToast } from "./hooks/useToast";

const App: React.FC = () => {
  const { setMessages, setFilesArr, socket, setDevicesArr } = useMyContext();
  const { Toast } = useToast();

  useEffect(() => {
    if (!socket) return;

    const onConnected = () => {
      console.log("connected from web!");
    };
    socket.on("connect", onConnected);

    const onError = (err:Error) => {
      console.log("socket connection error" + err.message);
    };
    socket.on("connect_error", onError);

    const onNewDevice = (connDevices: string[]) => {
      setDevicesArr(connDevices);
    };
    socket.on("new_device", onNewDevice);

    const onMessages = (data:{messages:string}) => {
      setMessages(data.messages);
    };
    socket.on("my_messages", onMessages);

    const onFiles = (data:{files:FileInfoType[]}) => {
      setFilesArr((prev) => [...prev, ...data.files]);
    };
    socket.on("my_files", onFiles);

    return () => {
      if (socket) {
        socket.off("connect",onConnected);
        socket.off("connect_error",onError);
        socket.off("new_device",onNewDevice);
        socket.off("my_messages",onMessages);
        socket.off("my_files",onFiles);
      }
    };
  }, [socket]);
  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Messages />} />
            <Route path="/files" element={<FilesPage />} />
            <Route path="/contact" element={<div>CONTACT</div>} />
          </Routes>
        </Layout>
        <Toast />
      </BrowserRouter>
    </>
  );
};

export default App;
