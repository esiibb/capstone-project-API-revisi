const { loadModel, loadScaler } = require('./model-utils');

async function predict(data) {
    const model = await loadModel();

    // Muat scaler untuk input dan output
    const skala_X = loadScaler('skala_X.json');
    const skala_Y = loadScaler('skala_Y.json');

    // Contoh normalisasi data input
    const normalizedInput = data.map((value, idx) => (value - skala_X.mean[idx]) / skala_X.std[idx]);

    // Prediksi
    const inputTensor = tf.tensor2d([normalizedInput]);
    const prediction = model.predict(inputTensor);
    const predictionArray = prediction.arraySync()[0];

    // Reverse normalization untuk output
    const finalPrediction = predictionArray.map((value, idx) => (value * skala_Y.std[idx]) + skala_Y.mean[idx]);

    return finalPrediction;
}

predict([16000, 4.50, 3.90]).then(result => console.log("Prediksi:", result));