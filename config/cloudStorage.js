const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
    projectId: "submissionmlgc-sakban-442408",
    keyFilename: "./service-account-key.json", 
});

const bucketName = "bucketsakban123";
const downloadModel = async (destination) => {
    try {
        const fileName = "bucketsakban123/model/model.json"; 
        const destinationPath = `${destination}/model.json`;

        console.log("Downloading model from Cloud Storage...");
        await storage.bucket(bucketName).file(fileName).download({ destination: destinationPath });
        console.log("Model downloaded to:", destinationPath);
    } catch (error) {
        console.error("Error downloading model:", error);
        throw error;
    }
};

module.exports = { downloadModel };
