export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  const { endpoint } = req.query
  if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' })

  try {
    const url = 'https://v3.football.api-sports.io/' + endpoint
    const response = await fetch(url, {
      headers: { 'x-apisports-key': 'e1719cc345d25f7e9cecc0f078e09d7c' }
    })
    const data = await response.json()
    res.status(200).json(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
