const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

require('./router')(app)

const port = process.env.PORT || 3001

app.use(express.static('client/build'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});


app.listen(port, (err) => {
    if (err) { console.log(err) }
    else {console.log('Server started at port ' + port)}
  })