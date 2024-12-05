const { predictCancer } = require("../models/inferenceModel");
const { v4: uuidv4 } = require("uuid");
const db = require("../../config/firebase");


const predict = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                status: "fail",
                message: "File tidak ditemukan atau tidak valid",
            });
        }

        const result = await predictCancer(file.path);

        const id = uuidv4();
        const response = {
            id,
            result: result ? "Cancer" : "Non-cancer",
            suggestion: result
                ? "Segera periksa ke dokter!"
                : "Penyakit kanker tidak terdeteksi.",
            createdAt: new Date().toISOString(),
        };

        // Simpan data ke Firestore
        await db.collection("predictions").doc(id).set(response);

        return res.status(201).json({
            status: "success",
            message: "Model is predicted successfully",
            data: response,
        });
    } catch (error) {
        console.error("Prediction Controller Error:", error.message);
        res.status(400).json({
            status: "fail",
            message: "Terjadi kesalahan dalam melakukan prediksi",
        });
    }
};

module.exports = { predict };
