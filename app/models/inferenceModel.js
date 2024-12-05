const tf = require("@tensorflow/tfjs-node");

let model;
const MODEL_URL = "https://storage.googleapis.com/bucketsakban123/model/model.json";
const loadModel = async () => {
    if (!model) {
        try {
            console.log("Loading graph model from Cloud Storage...");
            model = await tf.loadGraphModel(MODEL_URL); 
            console.log("Model loaded successfully.");
        } catch (error) {
            console.error("Error loading model:", error.message);
            throw new Error("Failed to load graph model.");
        }
    }
    return model;
};
const predictCancer = async (imagePath) => {
    try {
        const model = await loadModel();
        const fs = require("fs");
        const imageBuffer = fs.readFileSync(imagePath);
        const decodedImage = tf.node.decodeImage(imageBuffer);
        const resizedImage = tf.image.resizeBilinear(decodedImage, [224, 224]);
        const normalizedImage = resizedImage.div(255.0).expandDims(0);
        const predictions = model.execute({ MobilenetV3large_input: normalizedImage });
        const result = predictions.dataSync()[0]; 
        return result > 0.5;
    } catch (error) {
        console.log("Prediction raw value:", result)
        console.error("Prediction Error:", error.message);
        throw new Error("Prediction failed.");
    }
    
};
module.exports = { predictCancer };
