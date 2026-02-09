const express = require('express')
const path = require('path')
const compression = require('compression')

const app = express()
const PORT = process.env.PORT || 4000

// Enable gzip compression
app.use(compression())

// Validate URL before static middleware to prevent URIError
app.use((req, res, next) => {
  try {
    // Try to decode the URL to check if it's valid
    decodeURIComponent(req.url)
    next()
  } catch (err) {
    // If URL is malformed, skip static middleware and go to client-side routing
    return res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  }
})

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  etag: true,
}))

// Handle client-side routing (SPA fallback). No-cache so deployments reflect immediately.
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Error handling middleware (must be after all routes)
app.use((err, req, res, next) => {
  if (err instanceof URIError) {
    // Handle malformed URL - serve index.html for client-side routing
    return res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  }
  // For other errors, send 500
  console.error('Server error:', err)
  res.status(500).send('Internal Server Error')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 