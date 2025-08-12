// pages/api/sheets.js
const { google } = require('googleapis');

module.exports = async (req, res) => {
  try {
    // Dados de desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      return res.status(200).json({
        status: 'success',
        data: [{
          id: 'dev_1',
          nome: 'Cliente Teste'
        }]
      });
    }

    // Implementação real
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'A1:B10',
    });

    return res.status(200).json({
      status: 'success',
      data: response.data.values
    });

  } catch (error) {
    console.error('Sheets Error:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Falha ao acessar planilha'
    });
  }
};
