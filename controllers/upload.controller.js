const UploadController = async (req, res) => {
    if (!req.files) {
        return res.status(400).json({ message: "Something Went Wrong" });
    }
    const files = req.files.map((f) => ({
        fileName: f.originalname,
        size: f.size,
        srcName: f.filename,
        fileMimeType: f.mimetype
    }))
    res.status(200).json({ message: "File uploaded successfully", files });
}

module.exports = {UploadController}
