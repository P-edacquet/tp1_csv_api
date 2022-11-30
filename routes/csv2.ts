const router = require('express').Router();
const path = require('path');
const parse = require('csv-parser');
const fs = require('fs');
const unzipper = require('unzip-stream')
const download = require('download');

const zip_path:string = path.join(__dirname,'../StockEtablissementLiensSuccession_utf8.zip')

router.get('/tp2', async (req, res) => {

  async function getZip() {
    try {
      console.log("downloading file")

      const file:string = 'https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip';
      const filePath:string = path.join(__dirname,'../'); 

      download(file,filePath)
        .then(async function () {
          console.log('Download Completed');
          console.log("starting unzip_to_csv")
          unzip_to_csv();
          console.log("unzip_to_csv done")
        })
    } catch (error) {
      console.error(`ERROR: ${error}`)
    }
  }


  function unzip_to_csv() {
    var count_rows:number = 0;
    var count_transfert_sieges:number = 0;

    fs.createReadStream(zip_path)
      .pipe(unzipper.Parse())
      .on('entry', function (entry:any) {
        console.log(entry.path)
        console.log("AAAAAAA")
        console.log(entry)
        const fileName:string = entry.path;
        if (fileName === "StockEtablissementLiensSuccession_utf8.csv") {
          entry.pipe(parse()) 
          .on('data', (data:any) => {
            console.log(count_rows)
            count_rows += 1;
            if (data.transfertSiege == "true") {
              count_transfert_sieges += 1;
              console.log(count_transfert_sieges + "AAAAAAAAAAAAA")
            }
          })
          .on('end', () => {
            res.send(`${count_transfert_sieges * 100 / count_rows}`);
        })
        } else {
          console.log("Error")
          entry.autodrain();
        }
      });
  }

  async function run() {
    console.log("AAAA");

    if (!fs.existsSync(zip_path)) {
      console.log("BBBB");
      await getZip();
      console.log("CCCC");
    }else{
      console.log("C2C2C2C2");
      console.log("zip file already downloaded");
      unzip_to_csv();
    }
  }

  run();

});

module.exports = router;