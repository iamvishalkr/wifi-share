const express = require("express");
const { DownloadController } = require("../controllers/download.controller.js");

const router = express.Router();

router.get("/:filename", DownloadController);

// export default router;

module.exports = router;
