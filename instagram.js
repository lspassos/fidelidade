export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Por enquanto retornando dados simulados
    // Quando configurar o Instagram API, substituiremos isso
    
    const mentions = [
      {
        id: '1',
        username: 'cliente_exemplo',
        type: 'post',
        timestamp: new Date().toISOString(),
        media_url: '',
        text: 'Exemplo de menção @avidaeumafestacb',
      }
    ]

    return res.status(200).json({ mentions })
  } catch (error) {
    console.error('Instagram API Error:', error)
    return res.status(500).json({ 
      message: 'Error fetching Instagram data',
      error: error.message 
    })
  }
}
