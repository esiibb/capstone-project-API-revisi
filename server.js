const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 8080;

// data untuk 20 saham 
const stocks = [
    { code: 'CTRA', name: 'Ciputra Development Tbk', logo: 'ciputra.png', sector: 'Properti & Real Estat', description: 'Perusahaan pengembang properti terkemuka di Indonesia dengan berbagai proyek residensial, komersial, dan perhotelan.', website: 'www.ciputradevelopment.com' },
    { code: 'INDF', name: 'Indofood Sukses Makmur Tbk', logo: 'indofood.png', sector: 'Barang Konsumen Primer', description: 'Produsen makanan dan minuman terbesar di Indonesia, terkenal dengan produk mi instan dan minuman kemasan.', website: 'www.indofood.com' },
    { code: 'ASII', name: 'Astra International Tbk', logo: 'astra.png', sector: 'Perindustrian', description: 'Perusahaan multinasional dengan portofolio di otomotif, agribisnis, jasa keuangan, dan infrastruktur.', website: 'www.astra.co.id' },
    { code: 'BSDE', name: 'PT Bumi Serpong Damai Tbk', logo: 'bsdcity.png', sector: 'Properti & Real Estat', description: 'Pengembang kawasan perumahan dan komersial, dikenal dengan proyek BSD City.', website: 'www.bsdcity.com' },
    { code: 'ICBP', name: 'Indofood CBP Sukses Makmur Tbk', logo: 'indofoodcbp.png', sector: 'Barang Konsumen Primer', description: 'Anak perusahaan Indofood yang bergerak di bidang makanan kemasan, termasuk produk mi instan dan makanan ringan.', website: 'www.indofoodcbp.com' },
    { code: 'KLBF', name: 'Kalbe Farma Tbk', logo: 'kalbe.png', sector: 'Kesehatan', description: 'Perusahaan farmasi terbesar di Indonesia, memproduksi obat-obatan dan produk kesehatan.', website: 'www.kalbe.co.id' },
    { code: 'ITMG', name: 'Indo Tambangraya Megah Tbk', logo: 'itm.png', sector: 'Energi', description: 'Perusahaan tambang batubara dengan fokus pada produksi dan perdagangan batubara.', website: 'www.itmg.co.id' },
    { code: 'JPFA', name: 'JAPFA Comfeed Indonesia Tbk', logo: 'japfa.png', sector: 'Barang Konsumen Primer', description: 'Perusahaan agribisnis yang fokus pada produksi pangan dan pakan ternak di Indonesia.', website: 'www.japfacomfeed.co.id' },
    { code: 'TLKM', name: 'PT Telkom Indonesia (Persero) Tbk', logo: 'telkom.png', sector: 'Infrastruktur', description: 'Perusahaan telekomunikasi terbesar di Indonesia, menyediakan layanan telepon, internet, dan jaringan.', website: 'www.telkom.co.id' },
    { code: 'ULTJ', name: 'PT Ultrajaya Milk Industry & Trading Company Tbk', logo: 'ultrajaya.png', sector: 'Barang Konsumen Primer', description: 'Produsen susu dan minuman terkemuka di Indonesia dengan berbagai produk olahan susu.', website: 'www.ultrajaya.co.id' },
    { code: 'ACES', name: 'PT Aspirasi Hidup Indonesia Tbk', logo: 'aspirasi.png', sector: 'Barang Konsumen Non-Primer', description: 'Perusahaan ritel yang menyediakan perlengkapan rumah tangga dan alat perkakas dengan jaringan toko luas.', website: 'www.acehardware.co.id' },
    { code: 'TSPC', name: 'Tempo Scan Pacific Tbk', logo: 'temposcan.png', sector: 'Kesehatan', description: 'Perusahaan farmasi dengan berbagai produk kesehatan, termasuk obat-obatan dan kosmetik.', website: 'www.temposcangroup.com' },
    { code: 'SMAR', name: 'PT Sinar Mas Agro Resources and Technology Tbk', logo: 'smart.png', sector: 'Barang Konsumen Primer', description: 'Perusahaan agribisnis yang bergerak di bidang produksi dan pengolahan kelapa sawit.', website: 'www.smart-tbk.com' },
    { code: 'SMSM', name: 'Selamat Sempurna Tbk', logo: 'selamatsempurna.png', sector: 'Barang Konsumen Non-Primer', description: 'Produsen filter otomotif dan suku cadang kendaraan dengan pasar internasional.', website: 'www.smsm.co.id' },
    { code: 'JRPT', name: 'Jaya Real Property Tbk', logo: 'jayaproperti.png', sector: 'Properti & Real Estat', description: 'Pengembang properti yang fokus pada proyek perumahan dan komersial.', website: 'www.jayaproperty.com' },
    { code: 'DUTI', name: 'Duta Pertiwi Tbk', logo: 'dutapertiwi.png', sector: 'Properti & Real Estat', description: 'Bagian dari Sinar Mas Group yang bergerak di pengembangan properti residensial dan komersial.', website: 'www.sinarmasland.com' },
    { code: 'EPMT', name: 'Enseval Putera Megatrading Tbk', logo: 'enseval.png', sector: 'Barang Konsumen Primer', description: 'Distributor farmasi dan produk kesehatan terbesar di Indonesia.', website: 'www.enseval.com' },
    { code: 'SMCB', name: 'PT Solusi Bangun Indonesia Tbk', logo: 'solusibangun.png', sector: 'Barang Baku', description: 'Perusahaan semen dan bahan bangunan yang mendukung sektor konstruksi.', website: 'www.solusibangunindonesia.com' },
    { code: 'PWON', name: 'Pakuwon Jati Tbk', logo: 'pakuwonjati.png', sector: 'Properti & Real Estat', description: 'Pengembang properti yang terkenal dengan proyek pusat perbelanjaan dan perkantoran.', website: 'www.pakuwonjati.com' },
    { code: 'JSMR', name: 'PT Jasa Marga Tbk', logo: 'jasamarga.png', sector: 'Infrastruktur', description: 'Operator jalan tol terbesar di Indonesia dengan berbagai proyek jalan tol nasional.', website: 'www.jasamarga.com' },
];

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.get('/stocks', (req, res) => {
    const stockList = stocks.map(stock => ({
        code: stock.code,
        logo: `/images/${stock.logo}`
    }));
    res.json(stockList);
});

app.get('/stocks/details', (req, res) => {
    const stockDetails = stocks.map(stock => ({
        code: stock.code,
        name: stock.name,
        logo: `/images/${stock.logo}`,
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
        stock.logo = `/images/${stock.logo}`;
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