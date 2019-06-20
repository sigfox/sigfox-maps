const express = require('express');
const router = express.Router();
const config = require('../config');
const http = config.https ? require('https') : require('http');
const fs = require('fs');
const _ = require('lodash');


const tokenRetrieval = {
    hostname: config.sigfoxApiSite,
    path: config.publicMapPath,
    auth: config.sigfoxApiUser + ":" + config.sigfoxApiPassword
};

const filtered = ["AND", "ARE", "ARG", "AUS", "AUT", "BEL", "BRA", "CAN", "CHE", "CHL", "COL", "CRI", "CZE", "DEU", "DNK", "ECU", "ESP", "EST", "FIN", "FRA", "GBR", "GTM", "HKG", "HND", "HRV", "HUN", "IRL", "IRN", "ITA", "JPN", "KEN", "KOR", "LIE", "LUX", "MEX", "MLT", "MUS", "MYS", "NCL", "NLD", "NOR", "NZL", "OMN", "PAN", "PER", "POL", "PRI", "PRT", "PYF", "ROU", "SGP", "SLV", "SVK", "SWE", "THA", "TUN", "TWN", "URY", "USA", "ZAF"];
const geoJsonParsed = JSON.parse(fs.readFileSync('assets/WorldCountries.geojson'));
const countriesToDisplay = _.filter(geoJsonParsed.features, feature => _.find(filtered, e => e === feature.properties.ISO_A3) !== undefined);



router.get('/', function(req, res, next) {
    // Get the map address
    http.get(tokenRetrieval, (sigfoxResponse) => {
        let buff = "";
        sigfoxResponse.on('data', d => buff += d);
        sigfoxResponse.on('end', () => {
            if (sigfoxResponse.statusCode !== 200) {
            } else {
                const mapUrl = JSON.parse(buff).tmsTemplateUrl ;
                res.render('publicmap', {
                    title: 'Sigfox public map',
                    sigfoxMapUrl: mapUrl,
                    backgroundMap: config.backgroundMap,
                    countries: JSON.stringify(countriesToDisplay)
                });
            }
        })

    });
});

router.get('/countries', (req, res) => {

    res.send(countriesToDisplay);

});

module.exports = router;
