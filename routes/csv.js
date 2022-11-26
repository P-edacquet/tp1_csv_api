const router = require('express').Router();
const path = require('path');
const {parse} = require('csv-parse');
const fs = require('fs');

router.get('/tp1', (req, res) => {

const csvData = [];

fs.createReadStream(path.join(__dirname,'../','/test.csv'))
  .pipe(
    parse({
      delimiter: ','
    })
  )
  .on('data', function (dataRow) {
    csvData.push(dataRow);
  })
  .on('end', function () {
    console.log(csvData);
  })
  res.send('tp1');
});

module.exports = router;
