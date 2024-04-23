require('dotenv').config();
const express = require('express');
const cors = require('cors');
const QbQueryService = require('./QbQueryService');

const app = express();
app.use(cors());
app.use(express.json()); // Add this line to parse JSON bodies

const PORT = process.env.PORT || 3001;
const qbQueryService = new QbQueryService();

// Endpoint to fetch menu data
app.get('/', async (req, res) => {
    try {
        const menuData = await qbQueryService.fetchMenuData();
        res.json(menuData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/content/:id', async (req, res) => {
    const { id } = req.params;
    const { content, label } = await qbQueryService.fetchContentById(id);
    if (content !== 'Content not found') {
        res.json({ content, label });
    } else {
        res.status(404).json({ content, label });
    }
});

// Endpoint to handle contact form submissions
app.post('/api/contact', async (req, res) => {
    const formData = req.body;
    const result = await qbQueryService.submitContactForm(formData);
    if (result.success) {
        res.json({ message: 'Contact form submitted successfully.' });
    } else {
        res.status(500).json({ error: result.error });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
