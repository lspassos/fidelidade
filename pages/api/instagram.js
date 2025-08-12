

try {
  export default function handler(req, res) {
  res.status(200).json({ status: 'API Instagram funcionando' })
}

  // Configuração da API do Instagram
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  
  // Endpoint para buscar menções
  const apiUrl = `https://graph.instagram.com/2039154976491670/tags?access_token=${b2eb32339e96feb0f10e6441d9170fb5}`;

  // Busca dados reais da API
  const response = await axios.get(apiUrl);
  const mentions = response.data.data.map(mention => ({
    id: mention.id,
    username: mention.username,
    type: mention.media_type || 'post',
    timestamp: mention.timestamp,
    media_url: mention.media_url || '',
    text: mention.caption || `Menção de @avidaeumafestacb`
  }));

  return res.status(200).json({ mentions });
  
} catch (error) {
  console.error('Instagram API Error:', error);
  return res.status(500).json({ 
    message: 'Error fetching Instagram data',
    error: error.message 
  });
}
