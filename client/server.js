const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Write directly to client/public/metadata
const METADATA_DIR = path.join(__dirname, 'public', 'metadata');


app.use(cors());
app.use(bodyParser.json());

// Make sure metadata directory exists
if (!fs.existsSync(METADATA_DIR)) {
    fs.mkdirSync(METADATA_DIR, { recursive: true });
}

app.post('/api/saveMetadata', (req, res) => {
    const { title, author, image } = req.body;
    if (!title || !author || !image) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const filename = title.toLowerCase().replace(/\s+/g, '_') + '.json';
    const filePath = path.join(METADATA_DIR, filename);

    const metadata = {
        title,
        author,
        image
    };

    fs.writeFile(filePath, JSON.stringify(metadata, null, 2), (err) => {
        if (err) {
            console.error('Error saving metadata:', err);
            return res.status(500).json({ error: 'Failed to save metadata' });
        }
        console.log('Metadata saved at', filePath);
        res.json({ success: true, uri: '/metadata/' + filename });
    });
});

app.listen(PORT, () => {
    console.log(`Metadata server is running at http://localhost:${PORT}`);
});

