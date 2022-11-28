const router = require('express').Router();
const path = require('path');
const {parse} = require('csv-parse');
const fs = require('fs');
const https = require('https');
const unzipper = require('unzipper');


router.get('/tp1', (req, res) => {

  async function getZip() {
    try {
      if (!fs.existsSync(path.join(__dirname,'../StockEtablissementLiensSuccession_utf8.zip'))) {
        console.log("downloading file")
        var file = fs.createWriteStream("StockEtablissementLiensSuccession_utf8.zip");
   
        var request =  https.get("https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip", function(response) {
          response.pipe(file);
   
          file.on("finish", async () => {
            file.close();
            console.log("Download Completed");
          });
        });
      }else{
        console.log("File already downloaded");
      }

    } catch (error) {
      console.error(`ERROR: ${error}`)
    }
  }

  async function unzip_to_csv() {
    try{
      // getZip();
      fs.createReadStream(path.join(__dirname,'../StockEtablissementLiensSuccession_utf8.zip'))
        .pipe(unzipper.Parse())
        .on('entry', function (entry) {
          var fileName = entry.path;
          if (fileName === "StockEtablissementLiensSuccession_utf8.csv") {
            entry.pipe(fs.createWriteStream(path.join(__dirname,'../StockEtablissementLiensSuccession_utf8.csv')));
          } else {
            entry.autodrain();
          }
        });
    } catch (error) {
      console.error(`ERROR: ${error}`)
    }
  }

  async function getTransfertSiegePercentage() {
    try{
      // unzip_to_csv();

    const datas = [];

    fs.createReadStream(path.join(__dirname,'../StockEtablissementLiensSuccession_utf8.csv'))
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

  getTransfertSiegePercentage()

});

module.exports = router;