// pages/api/sheets.js
const { google } = require('googleapis');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Dados mockados para desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      return res.status(200).json({
        status: 'success',
        data: [{
          id: 1,
          nome: 'Cliente Teste',
          pontos: 150,
          ultimaVisita: new Date().toISOString()
        }]
      });
    }

    // Autenticação com Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Clientes!A2:D',
    });

    // Processamento dos dados
    const data = response.data.values.map(row => ({
      id: row[0],
      nome: row[1],
      telefone: row[2],
      pontos: parseInt(row[3]) || 0
    }));

    return res.status(200).json({
      status: 'success',
      count: data.length,
      data
    });

  } catch (error) {
    console.error('Erro Google Sheets:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Erro ao acessar planilha',
      ...(process.env.NODE_ENV !== 'production' && { 
        error: error.message,
        stack: error.stack 
      })
    });
  }
};
