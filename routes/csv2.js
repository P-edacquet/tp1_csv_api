var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var router = require('express').Router();
var path = require('path');
var parse = require('csv-parser');
var fs = require('fs');
var unzipper = require('unzip-stream');
var download = require('download');
router.get('/tp2', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    function getZip() {
        return __awaiter(this, void 0, void 0, function () {
            var file, filePath;
            return __generator(this, function (_a) {
                try {
                    console.log("downloading file");
                    file = 'https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip';
                    filePath = path.join(__dirname, '../');
                    download(file, filePath)
                        .then(function () {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                console.log('Download Completed');
                                console.log("starting unzip_to_csv");
                                unzip_to_csv();
                                return [2 /*return*/];
                            });
                        });
                    });
                }
                catch (error) {
                    console.error("ERROR: ".concat(error));
                }
                return [2 /*return*/];
            });
        });
    }
    function unzip_to_csv() {
        var count_rows = 0;
        var count_transfert_sieges = 0;
        fs.createReadStream(zip_path)
            .pipe(unzipper.Parse())
            .on('entry', function (entry) {
            var fileName = entry.path;
            if (fileName === "StockEtablissementLiensSuccession_utf8.csv") {
                entry.pipe(parse())
                    .on('data', function (data) {
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
                    .on('end', function () {
                    res.send("".concat(count_transfert_sieges * 100 / count_rows));
                });
            }
            else {
                console.log("Error");
                entry.autodrain();
            }
        });
    }
    function run() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!fs.existsSync(zip_path)) return [3 /*break*/, 2];
                        return [4 /*yield*/, getZip()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        console.log("zip file already downloaded, starting unzip_to_csv");
                        unzip_to_csv();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    var zip_path;
    return __generator(this, function (_a) {
        zip_path = path.join(__dirname, '../StockEtablissementLiensSuccession_utf8.zip');
        run();
        return [2 /*return*/];
    });
}); });
module.exports = router;
