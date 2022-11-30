const router = require('express').Router();
const path = require('path');
const parse = require('csv-parser');
const fs = require('fs');
const unzipper = require('unzip-stream')
const download = require('download');


router.get('/tp1', async (req, res) => {

  const zip_path = path.join(__dirname,'../StockEtablissementLiensSuccession_utf8.zip')

  async function getZip() {
    try {
      const file = 'https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip';
      const filePath = path.join(__dirname,'../');

      console.log("downloading file")
      download(file,filePath)
        .then(async function () {
          console.log('Download Completed');
          console.log("starting unzip_to_csv")
          unzip_to_csv();
        })
    } catch (error) {
      console.error(`ERROR: ${error}`)
    }
  }


  function unzip_to_csv() {
    var count_rows = 0;
    var count_transfert_sieges = 0;

    fs.createReadStream(zip_path)
      .pipe(unzipper.Parse())
      .on('entry', function (entry) {
        const fileName = entry.path;
        if (fileName === "StockEtablissementLiensSuccession_utf8.csv") {
          entry.pipe(parse()) 
          .on('data', (data) => {
            //*************************/
            // IF YOU WANT TO SEE     */
            // THE PARSE PART WORKING,*/
            // UNCOMMENT THE TWO NEXT */
            // CONSOLE.LOG            */
            //*************************/

            // console.log(count_rows)
            if (data.dateLienSuccession < Date('2022-11-01')) {
              count_rows += 1;
              if (data.transfertSiege == "true") {
                count_transfert_sieges += 1;
                // console.log("count_transfert_sieges: " + count_transfert_sieges)
            }
            }
          })
          .on('end', () => {
          res.send(count_transfert_sieges * 100 / count_rows);
        })
        } else {
          console.log("Error")
          entry.autodrain();
        }
      });
  }

  async function run() {
    if (!fs.existsSync(zip_path)) {
      await getZip();
    }else{
      console.log("zip file already downloaded, starting unzip_to_csv");
      unzip_to_csv();
    }
  }

  run()

  //Obsolete
  /*
  async function getTransfertSiegePercentage() {
    try{
      const datas = [];

    fs.createReadStream(csv_path)
      .pipe(
        parse({
          delimiter: ',',
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
    } catch (error) {
      console.error(`ERROR: ${error}`)
    }
  }
  */

});

module.exports = router;