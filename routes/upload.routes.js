const express = require("express");
const path = require("path");
const { UploadController } = require("../controllers/upload.controller.js");
const multer = require("multer");

const router = express.Router();

const FileCountLimit = 10;

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: path.join(process.cwd(), "public", "uploads"),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, timestamp + "-" + file.originalname);
  },
});
// Error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res
      .status(500)
      .json({ error: "Too many files uploaded. Limit is 10." });
  } else if (err) {
    // Handle other general errors
    return res.status(500).json({ error: "Server error occurred." });
  }
  next(); // If no error, proceed to the next middleware/route handler
};

const upload = multer({ storage });

router.post(
  "/",
  upload.array("file", FileCountLimit),
  handleMulterError,
  UploadController
);

// export default router;
module.exports = router;
