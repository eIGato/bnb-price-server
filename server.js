import express from 'express'
import cors from 'cors'
import rateLimit from "express-rate-limit"

const app = express()
const port = 3000

const allowedOrigin = 'http://localhost:5173'

app.use(cors({ origin: allowedOrigin }))
app.use(
  rateLimit({
    windowMs: 60_000, // 1 minute
    max: 10,
    message: { error: "Too many requests" },
    standardHeaders: true,
    legacyHeaders: false,
  })
)

let lastPrice = 680.00
let lastUpdated = new Date()
let cachedResponse = null

app.get('/api/bnb-price', (req, res) => {
  const now = new Date()
  const diff = (now - lastUpdated) / 1000

  if (cachedResponse && diff < 6) {
    return res.json(cachedResponse)
  }

  const delta = lastPrice * (Math.random() * 0.04 - 0.02) // ±2%
  const newPrice = parseFloat((lastPrice + delta).toFixed(2))
  const up = newPrice > lastPrice

  lastPrice = newPrice
  lastUpdated = now
  cachedResponse = {
    price: newPrice,
    lastUpdated: now.toISOString(),
    up,
  }

  res.json(cachedResponse)
})

app.listen(port, () => {
  console.log(`BNB server listening on http://localhost:${port}`)
})
