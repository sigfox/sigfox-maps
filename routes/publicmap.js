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

const filtered = ["AND", "ARE", "ARG", "AUS", "AUT", "BEL", "BGR", "BRA", "BWA", "CAN", "CIV", "CHE", "CHL", "COL", "CRI", "CZE", "DEU", "DNK", "ECU", "ESP", "EST", "FIN", "FRA", "GBR", "GRC", "GTM", "HKG", "HND", "HRV", "HUN", "IDN", "IRL", "ITA", "JPN", "KEN", "KOR", "LIE", "LTU", "LUX", "LVA", "MEX", "MLT", "MUS", "MYS", "NCL", "NGA", "NLD", "NOR", "NZL", "OMN", "PAN", "PER", "PNG", "POL", "PRI", "PRT", "PYF", "REU", "ROU", "RUS", "SAU", "SEN", "SGP", "SLV", "SRB", "SVK", "SWE", "SWZ", "THA", "TUN", "TWN", "URY", "USA", "ZAF"];
const geoJsonParsed = JSON.parse(fs.readFileSync('assets/WorldCountries.geojson'));
const countriesToDisplay = _.filter(geoJsonParsed.features, feature => _.find(filtered, e => e === feature.properties.ISO_A3) !== undefined);

// from https://snazzymaps.com/style/151/ultra-light-with-labels
const googleStyle = JSON.parse(fs.readFileSync('assets/google-light-style.json'));


router.get('/', function(req, res, next) {
    // Get the map address
    http.get(tokenRetrieval, (sigfoxResponse) => {
        let buff = "";
        sigfoxResponse.on('data', d => buff += d);
        sigfoxResponse.on('end', () => {
            if (sigfoxResponse.statusCode !== 200) {
                res.render('error', {
                    message: 'Impossible to load Public layer',
                    error: {
                        status: sigfoxResponse.statusCode,
                        stack: sigfoxResponse.statusMessage,
                    }
                });
            } else {
                const mapUrl = JSON.parse(buff).tmsTemplateUrl ;
                res.render('publicmap', {
                    title: 'Sigfox public map',
                    sigfoxMapUrl: mapUrl,
                    countries: JSON.stringify(countriesToDisplay),
                    backgroundMap: config.backgroundMap,
                    backgroundMapType: config.backgroundMapType,
                    googleStyle: JSON.stringify(googleStyle),
                    googleToken: config.googleToken,
                    hereAppId: config.hereAppId,
                    hereAppCode: config.hereAppCode,
                    bingKey: config.bingKey
                });
            }
        })

    });
});

router.get('/countries', (req, res) => {

    res.send(countriesToDisplay);

});

module.exports = router;
