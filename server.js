const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 5000

// Routes
app.get('/api/test', (req, res) => {
  res.send('This test string come from server!')
})

// Static files
app.use(express.static(path.join(__dirname, 'client/build')))

// Production mode
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname = 'client/build/index.html'));
  })
}

// Dev mode 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/public/index.html'));
})

// Start server
app.listen(port, (req, res) => {
  console.log(`server listening on port: ${port}`)
})