import { google } from 'googleapis'

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    if (req.method === 'GET') {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'A2:G1000',
      })

      const rows = response.data.values || []
      const customers = rows.map((row, index) => ({
        id: index + 1,
        name: row[0] || '',
        username: row[1] || '',
        points: parseInt(row[2]) || 0,
        posts: parseInt(row[3]) || 0,
        stories: parseInt(row[4]) || 0,
        lastActivity: row[5] || '',
        email: row[6] || '',
      }))

      return res.status(200).json({ customers })
    }

    if (req.method === 'POST') {
      const { name, username, points, posts, stories, email } = req.body

      const values = [[
        name,
        username,
        points,
        posts,
        stories,
        new Date().toISOString().split('T')[0],
        email
      ]]

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'A2:G2',
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      })

      return res.status(200).json({ message: 'Data saved successfully' })
    }
  } catch (error) {
    console.error('Sheets API Error:', error)
    return res.status(500).json({ 
      message: 'Error accessing Google Sheets',
      error: error.message 
    })
  }
}
