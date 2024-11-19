const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 8080;

// data untuk 20 saham 
const stocks =
[
    { 
        code: 'CTRA', 
        name: 'Ciputra Development Tbk', 
        logo: 'ciputra.png', 
        sector: 'Property & Real Estate', 
        description: 'A leading property developer in Indonesia with various residential, commercial, and hospitality projects.', 
        website: 'www.ciputradevelopment.com' 
    },
    { 
        code: 'INDF', 
        name: 'Indofood Sukses Makmur Tbk', 
        logo: 'indofood.png', 
        sector: 'Consumer Staples', 
        description: 'The largest food and beverage producer in Indonesia, known for its instant noodles and packaged drinks.', 
        website: 'www.indofood.com' 
    },
    { 
        code: 'ASII', 
        name: 'Astra International Tbk', 
        logo: 'astra.png', 
        sector: 'Industrials', 
        description: 'A multinational company with a portfolio in automotive, agribusiness, financial services, and infrastructure.', 
        website: 'www.astra.co.id' 
    },
    { 
        code: 'BSDE', 
        name: 'PT Bumi Serpong Damai Tbk', 
        logo: 'bsdcity.png', 
        sector: 'Property & Real Estate', 
        description: 'A developer of residential and commercial areas, known for the BSD City project.', 
        website: 'www.bsdcity.com' 
    },
    { 
        code: 'ICBP', 
        name: 'Indofood CBP Sukses Makmur Tbk', 
        logo: 'indofoodcbp.png', 
        sector: 'Consumer Staples', 
        description: 'A subsidiary of Indofood engaged in packaged food, including instant noodles and snacks.', 
        website: 'www.indofoodcbp.com' 
    },
    { 
        code: 'KLBF', 
        name: 'Kalbe Farma Tbk', 
        logo: 'kalbe.png', 
        sector: 'Health', 
        description: 'The largest pharmaceutical company in Indonesia, producing medicines and health products.', 
        website: 'www.kalbe.co.id' 
    },
    { 
        code: 'ITMG', 
        name: 'Indo Tambangraya Megah Tbk', 
        logo: 'itm.png', 
        sector: 'Energy', 
        description: 'A coal mining company focused on coal production and trading.', 
        website: 'www.itmg.co.id' 
    },
    { 
        code: 'JPFA', 
        name: 'JAPFA Comfeed Indonesia Tbk', 
        logo: 'japfa.png', 
        sector: 'Consumer Staples', 
        description: 'An agribusiness company focused on food and animal feed production in Indonesia.', 
        website: 'www.japfacomfeed.co.id' 
    },
    { 
        code: 'TLKM', 
        name: 'PT Telkom Indonesia (Persero) Tbk', 
        logo: 'telkom.png', 
        sector: 'Infrastructure', 
        description: 'The largest telecommunications company in Indonesia, providing telephone, internet, and network services.', 
        website: 'www.telkom.co.id' 
    },
    { 
        code: 'ULTJ', 
        name: 'PT Ultrajaya Milk Industry & Trading Company Tbk', 
        logo: 'ultrajaya.png', 
        sector: 'Consumer Staples', 
        description: 'A leading milk and beverage producer in Indonesia with various dairy products.', 
        website: 'www.ultrajaya.co.id' 
    },
    { 
        code: 'ACES', 
        name: 'PT Aspirasi Hidup Indonesia Tbk', 
        logo: 'aspirasi.png', 
        sector: 'Consumer Discretionary', 
        description: 'A retail company offering household supplies and tools with a wide network of stores.', 
        website: 'www.acehardware.co.id' 
    },
    { 
        code: 'TSPC', 
        name: 'Tempo Scan Pacific Tbk', 
        logo: 'temposcan.png', 
        sector: 'Health', 
        description: 'A pharmaceutical company with various health products, including medicines and cosmetics.', 
        website: 'www.temposcangroup.com' 
    },
    { 
        code: 'SMAR', 
        name: 'PT Sinar Mas Agro Resources and Technology Tbk', 
        logo: 'smart.png', 
        sector: 'Consumer Staples', 
        description: 'An agribusiness company engaged in palm oil production and processing.', 
        website: 'www.smart-tbk.com' 
    },
    { 
        code: 'SMSM', 
        name: 'Selamat Sempurna Tbk', 
        logo: 'selamatsempurna.png', 
        sector: 'Consumer Discretionary', 
        description: 'A producer of automotive filters and vehicle spare parts with an international market.', 
        website: 'www.smsm.co.id' 
    },
    { 
        code: 'JRPT', 
        name: 'Jaya Real Property Tbk', 
        logo: 'jayaproperti.png', 
        sector: 'Property & Real Estate', 
        description: 'A property developer focused on residential and commercial projects.', 
        website: 'www.jayaproperty.com' 
    },
    { 
        code: 'DUTI', 
        name: 'Duta Pertiwi Tbk', 
        logo: 'dutapertiwi.png', 
        sector: 'Property & Real Estate', 
        description: 'A part of Sinar Mas Group engaged in residential and commercial property development.', 
        website: 'www.sinarmasland.com' 
    },
    { 
        code: 'EPMT', 
        name: 'Enseval Putera Megatrading Tbk', 
        logo: 'enseval.png', 
        sector: 'Consumer Staples', 
        description: 'The largest pharmaceutical and health product distributor in Indonesia.', 
        website: 'www.enseval.com' 
    },
    { 
        code: 'SMCB', 
        name: 'PT Solusi Bangun Indonesia Tbk', 
        logo: 'solusibangun.png', 
        sector: 'Basic Materials', 
        description: 'A cement and building materials company supporting the construction sector.', 
        website: 'www.solusibangunindonesia.com' 
    },
    { 
        code: 'PWON', 
        name: 'Pakuwon Jati Tbk', 
        logo: 'pakuwonjati.png', 
        sector: 'Property & Real Estate', 
        description: 'A property developer known for its shopping center and office projects.', 
        website: 'www.pakuwonjati.com' 
    },
    { 
        code: 'JSMR', 
        name: 'PT Jasa Marga Tbk', 
        logo: 'jasamarga.png', 
        sector: 'Infrastructure', 
        description: 'The largest toll road operator in Indonesia with various national toll road projects.', 
        website: 'www.jasamarga.com' 
    }

]

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));


const getFullImageUrl = (req, logo) => `${req.protocol}://${req.get('host')}/images/${logo}`;

app.get('/stocks', (req, res) => {
    const stockList = stocks.map(stock => ({
        code: stock.code,
        logo: getFullImageUrl(req, stock.logo)
    }));
    res.json(stockList);
});

app.get('/stocks/details', (req, res) => {
    const stockDetails = stocks.map(stock => ({
        code: stock.code,
        name: stock.name,
        logo: getFullImageUrl(req, stock.logo),
        sector: stock.sector,
        description: stock.description,
        website: stock.website
    }));
    res.json(stockDetails);
});

app.get('/stocks/:code', (req, res) => {
    const stockCode = req.params.code.toUpperCase();
    const stock = stocks.find(s => s.code === stockCode);

    if (stock) {
        stock.logo = getFullImageUrl(req, stock.logo);
        res.json(stock);
    } else {
        res.status(404).json({ message: 'Stock not found' });
    }
});

let model;

// Memuat model TensorFlow
async function loadModel() {
    try {
        const modelPath = path.join(__dirname, 'models', 'model.json');
        model = await tf.loadGraphModel(`file://${modelPath}`);
        console.log("Model loaded successfully");
    } catch (error) {
        console.error("Error loading model:", error);
    }
}

// Memuat model saat server mulai
loadModel();

// Memuat data skala (X dan Y)
let skala_X, skala_Y;
try {
    console.log('Loading skala_X from', path.join(__dirname, 'scalers', 'skala_X.json'));
    skala_X = JSON.parse(fs.readFileSync(path.join(__dirname, 'scalers', 'skala_X.json')));
    console.log('skala_X loaded successfully');
} catch (error) {
    console.error('Error loading skala_X:', error);
}

try {
    console.log('Loading skala_Y from', path.join(__dirname, 'scalers', 'skala_Y.json'));
    skala_Y = JSON.parse(fs.readFileSync(path.join(__dirname, 'scalers', 'skala_Y.json')));
    console.log('skala_Y loaded successfully');
} catch (error) {
    console.error('Error loading skala_Y:', error);
}

// Route untuk prediksi
app.post('/predict', async (req, res) => {
    try {
        const { exchange_rate, bi_rate, inflation_rate } = req.body;

        // Standarisasi data input
        const dataBaruStandarisasi = [
            (exchange_rate - skala_X.mean[0]) / skala_X.std[0],
            (bi_rate - skala_X.mean[1]) / skala_X.std[1],
            (inflation_rate - skala_X.mean[2]) / skala_X.std[2]
        ];

        // Membuat tensor input
        const inputTensor = tf.tensor2d([dataBaruStandarisasi], [1, 3]);

        // Prediksi menggunakan model
        const prediksiStandarisasi = model.predict(inputTensor);
        const prediksiStandarisasiArray = await prediksiStandarisasi.array();

        // Denormalisasi hasil prediksi
        const prediksi = prediksiStandarisasiArray[0].map((p, i) => {
            return (p * skala_Y.std[i]) + skala_Y.mean[i];
        });

        // Membuat objek hasil prediksi menggunakan data dari stocks
        const hasilPrediksi = stocks.reduce((acc, stock, index) => {
            if (index < prediksi.length) {
                acc[stock.code] = prediksi[index].toFixed(2);
            }
            return acc;
        }, {});

        res.json({ prediction: hasilPrediksi });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan dalam proses prediksi' });
    }
});


app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
})