// pages/api/instagram.js
const axios = require('axios');

module.exports = async (req, res) => {
  // Verificação básica de segurança
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  try {
    // Dados mockados para desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      return res.status(200).json({
        status: 'success',
        data: [{
          id: 'dev_'+Math.random().toString(36).substring(7),
          username: 'dev_account',
          media_url: 'https://example.com/image.jpg',
          timestamp: new Date().toISOString()
        }]
      });
    }
    
    // Configuração de produção
    const response = await axios.get(`https://graph.instagram.com/${process.env.INSTAGRAM_USER_ID}/media`, {
      params: {
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
        fields: 'id,caption,media_type,media_url,permalink,timestamp'
      }
    });
    
    // Cache de 1 hora
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
    return res.status(200).json({
      status: 'success',
      data: response.data.data
    });
  } catch (error) {
    console.error('Erro Instagram API:', error.response?.data || error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar dados do Instagram',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message })
    });
  }
};
