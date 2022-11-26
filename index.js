const express = require('express');
const Routes = require('./routes/csv');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/', Routes);

app.listen(3000, () => {
  console.log('Successfully started express application!');
});
