// Importações no topo do arquivo
import axios from 'axios';

export default async function handler(req, res) {
  // 1. Verificação do método HTTP
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ 
      error: 'Method not allowed' 
    });
  }

  try {
    // 2. Modo desenvolvimento - dados mockados
    if (process.env.NODE_ENV !== 'production') {
      return res.status(200).json({
        status: 'success',
        mentions: [{
          id: 'dev_1',
          username: 'dev_user',
          type: 'post',
          timestamp: new Date().toISOString(),
          media_url: '',
          text: 'Exemplo de menção @avidaeumafestacb'
        }]
      });
    }

    // 3. Configuração de produção
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const userId = process.env.INSTAGRAM_USER_ID;

    if (!accessToken || !userId) {
      throw new Error('Variáveis de ambiente não configuradas');
    }

    const apiUrl = `https://graph.instagram.com/${userId}/tags?access_token=${accessToken}`;
    const response = await axios.get(apiUrl);

    // 4. Formatação da resposta
    const mentions = response.data.data?.map(item => ({
      id: item.id,
      username: item.username || 'unknown',
      type: item.media_type || 'post',
      timestamp: item.timestamp || new Date().toISOString(),
      media_url: item.media_url || '',
      text: item.caption || `Menção de @${item.username || 'usuário'}`
    })) || [];

    // 5. Configuração de cache
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

    return res.status(200).json({
      status: 'success',
      count: mentions.length,
      mentions
    });

  } catch (error) {
    console.error('Erro na API Instagram:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar dados',
      ...(process.env.NODE_ENV !== 'production' && {
        error: error.message
      })
    });
  }
}
