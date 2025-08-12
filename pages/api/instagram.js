import axios from 'axios';

export default async function handler(req, res) {
  try {
    // 1. Configuração segura com variáveis de ambiente
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const userId = process.env.INSTAGRAM_USER_ID;
    
    if (!accessToken || !userId) {
      return res.status(500).json({ 
        message: 'Instagram API not configured',
        error: 'Missing environment variables' 
      });
    }

    // 2. Endpoint seguro - NUNCA coloque tokens diretamente no código!
    const apiUrl = `https://graph.instagram.com/${userId}/tags?access_token=${accessToken}`;

    // 3. Busca dados com tratamento de erro
    const response = await axios.get(apiUrl);
    
    if (!response.data.data) {
      return res.status(200).json({ 
        status: 'success',
        message: 'No mentions found',
        mentions: []
      });
    }

    // 4. Formatação dos dados
    const mentions = response.data.data.map(mention => ({
      id: mention.id,
      username: mention.username,
      type: mention.media_type || 'post',
      timestamp: mention.timestamp,
      media_url: mention.media_url || '',
      text: mention.caption || `Menção de @${mention.username}`
    }));

    // 5. Cache control para evitar problemas
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    
    return res.status(200).json({ 
      status: 'success',
      mentions
    });
    
  } catch (error) {
    console.error('Instagram API Error:', error);
    
    // 6. Tratamento de erros específicos
    if (error.response?.status === 400) {
      return res.status(400).json({ 
        message: 'Invalid Instagram API request',
        error: error.message 
      });
    }
    
    return res.status(500).json({ 
      message: 'Error fetching Instagram data',
      error: error.message 
    });
  }
}
