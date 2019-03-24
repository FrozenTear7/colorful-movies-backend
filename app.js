const express = require('express')
const path = require('path')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.send('Welcome to Colorful Movies')
})

app.listen(3001, () => {
  console.log('Server running')
})
