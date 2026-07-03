const DownloadController = async (req, res) => {
    const filename = req.params.filename;

    res.download('public/uploads/'+ filename, filename.substring(filename.indexOf("-") + 1), (err) => { //Use res.download for simplicity.
        if (err) {
            console.error('Download error:', err);
            if (!res.headersSent) {
                res.status(500).send('Internal Server Error');
            }
        }
    });
}
module.exports = {DownloadController}
