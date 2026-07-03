const fs = require("fs");
const path = require("path");

const cleanUp = () => {
  try {
    const directory = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    fs.readdir(directory, (err, files) => {
      if (err) {
        console.error("Failed to read dir", err.message);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) {
            console.error("failed to delete file" + file + err.message);
          }
          console.log("Clean up file");
        });
      }
    });
  } catch (error) {}
};

module.exports = { cleanUp };
