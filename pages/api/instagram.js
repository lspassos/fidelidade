// pages/api/instagram.js
const axios = require('axios');

module.exports = async (req, res) => {
  try {
    // Modo desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      return res.status(200).json({
        status: 'success',
        data: [{
          id: 'dev_1',
          username: 'cliente_exemplo'
        }]
      });
    }

    // Implementação real da API
    const response = await axios.get(`https://api.instagram.com/...`);
    
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(response.data);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Falha na API Instagram'
    });
  }
};
