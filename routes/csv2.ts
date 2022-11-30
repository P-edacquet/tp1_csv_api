const router = require('express').Router();
const path = require('path');
const parse = require('csv-parser');
const fs = require('fs');
const unzipper = require('unzip-stream')
const download = require('download');

router.get('/tp2', async (res:any) => {

  const zip_path:string = path.join(__dirname,'../StockEtablissementLiensSuccession_utf8.zip')

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
        const fileName:string = entry.path;
        if (fileName === "StockEtablissementLiensSuccession_utf8.csv") {
          entry.pipe(parse()) 
          .on('data', (data:any) => {

            //*************************/
            // IF YOU WANT TO SEE     */
            // THE PARSE PART WORKING,*/
            // UNCOMMENT THE TWO NEXT */
            // CONSOLE.LOG            */
            //*************************/

            // console.log(count_rows)
            count_rows += 1;
            if (data.transfertSiege == "true") {
              count_transfert_sieges += 1;
              // console.log("count_transfert_sieges: " + count_transfert_sieges)
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
    if (!fs.existsSync(zip_path)) {
      await getZip();
    }else{
      console.log("zip file already downloaded");
      unzip_to_csv();
    }
  }

  run();

});

module.exports = router;