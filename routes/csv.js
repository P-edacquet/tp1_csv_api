const router = require('express').Router();
const path = require('path');
const {parse} = require('csv-parse');
const fs = require('fs');

router.get('/tp1', async (req, res) => {

  const datas = [];

  fs.createReadStream(path.join(__dirname,'../','/StockEtablissementLiensSuccession_utf8.csv'))
    .pipe(

      parse({

        delimiter: ',',
        from: 1,
        to: 100000,
        columns: true

      })
    )

    .on('data', function (data) {

      const transfert_sieges = {
        value: data.transfertSiege,
        date: data.dateDernierTraitementLienSuccession
      }
      datas.push(transfert_sieges);

    })

    .on('end', function () {

      // Setup variables for percentage calc
      var count_rows = 0;
      var count_transfert_sieges = 0;

      // Loop on datas for counting both variables
      datas.forEach((data) => {

        console.log(data.date);
        if (data.date < Date('2022-11-01')) {
            count_rows += 1;

          if (data.value == "true") {
            count_transfert_sieges += 1;
          }
        }
      })

      // Return the percentage
      res.send(`${count_transfert_sieges * 100 / count_rows}`);

    })
  }
);

module.exports = router;
