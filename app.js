const express = require("express");
const multer = require("multer");
const predictionRoutes = require("./app/routes/predictionRoutes");
const app = express();
const PORT = process.env.PORT || 3000;
const admin = require("firebase-admin");
const serviceAccount = require("./service-account-key.json");
const db = require("./config/firebase");

module.exports = db;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 1000000 }, 
}).single("image");
app.use("/predict", (req, res, next) => upload(req, res, (err) => {
    if (err) {
        return res.status(413).json({
            status: "fail",
            message: "Payload content length greater than maximum allowed: 1000000",
        });
    }
    next();
}), predictionRoutes);
app.use((err, req, res, next) => {
    res.status(400).json({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
