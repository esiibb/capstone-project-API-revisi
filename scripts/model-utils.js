const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const fs = require('fs');

async function loadModel() {
    const modelPath = path.join(__dirname, '../models/model_terbaik.keras');
    const model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log("Model loaded successfully");
    return model;
}

function loadScaler(scalerPath) {
    const scalerData = JSON.parse(fs.readFileSync(path.join(__dirname, '../scalers', scalerPath)));
    return scalerData;
}

module.exports = { loadModel, loadScaler };