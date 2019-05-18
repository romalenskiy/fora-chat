const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path')
const port = process.env.PORT || 5000

// Routes
app.get('/api/test', (req, res) => {
  res.send('This test string come from server!')
})

// Production mode
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  })
}

// Socket
let userList = []

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('user connected chat room', (username) => {
    console.log(`user ${username} connected`)
    userList.push({ id: socket.id, username })
    io.emit('user connected chat room', userList)
  })

  socket.on('chat message', (message) => {
    console.log(`message: ${message.value}`)
    socket.broadcast.emit('chat message', message)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
    userList = userList.filter((user) => user.id !== socket.id)
    socket.broadcast.emit('user disconnected chat room', userList)
  })
})

// Start server
server.listen(port, () => {
  console.log(`server listening on port: ${port}`)
})