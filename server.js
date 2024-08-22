const express = require('express');
const axios = require('axios');
const app = express();
const port = 3025;

// Убедитесь, что у вас есть API_KEY
const API_KEY = 'AHCO3MMTZPF5ZHYAAAAJMZSUGTJ33HZWFSJWCZPYRGDZSVXFQ3Z3NVB4CW6VALWWZIRSOWY'; // Замените на ваш фактический API ключ

app.use(express.static('public'));

app.get('/api/getTransaction', async (req, res) => {
    const { boc } = req.query;

    if (!boc) {
        return res.status(400).send('Parameter "boc" is required');
    }

    try {
        const response = await axios.get('https://tonapi.io/v2/transaction', {
            params: { boc },
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });

        if (response.status === 200) {
            res.json(response.data);
        } else {
            res.status(response.status).send(`Error: ${response.statusText}`);
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error('Error 404: Resource not found. Check the API URL and path.');
        } else {
            console.error('Error fetching transaction:', error.response ? error.response.data : error.message);
        }
        res.status(500).send(error.response ? error.response.data : 'Error fetching transaction');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});