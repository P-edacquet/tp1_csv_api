const express = require('express');
const Routes = require('./routes/csv');
const Routes2 = require('./routes/csv2');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/', Routes);

app.use('/', Routes2);

app.listen(3000, () => {
  console.log('Successfully started express application!');
});
