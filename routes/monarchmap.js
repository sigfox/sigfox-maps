const express = require('express');
const router = express.Router();
const config = require('../config');
const http = config.https ? require('https') : require('http');
const fs = require('fs');

const tokenRetrieval = {
    hostname: config.sigfoxApiSite,
    path: config.monarchMapPath,
    auth: config.sigfoxApiUser + ":" + config.sigfoxApiPassword
};

// from https://snazzymaps.com/style/151/ultra-light-with-labels
const googleStyle = JSON.parse(fs.readFileSync('assets/google-light-style.json'));
const fragmentShader = fs.readFileSync('assets/monarch-fragment-shader.gl');

router.get('/', function(req, res, next) {
    // Get the map address
    http.get(tokenRetrieval, (sigfoxResponse) => {
        let buff = "";
        sigfoxResponse.on('data', d => buff += d);
        sigfoxResponse.on('end', () => {
            if (sigfoxResponse.statusCode !== 200) {
                res.render('error', {
                    message: 'Impossible to load Monarch layer',
                    error: {
                        status: sigfoxResponse.statusCode,
                        stack: sigfoxResponse.statusMessage,
                    }
                });
            } else {
                const mapUrl = JSON.parse(buff).tmsTemplateUrl ;
                res.render('monarchmap', {
                    title: 'Sigfox Monarch coverage map',
                    sigfoxMapUrl: mapUrl,
                    backgroundMap: config.backgroundMap,
                    backgroundMapType: config.backgroundMapType,
                    googleStyle: JSON.stringify(googleStyle),
                    fragmentShader: fragmentShader,
                    googleToken: config.googleToken,
                    hereAppId: config.hereAppId,
                    hereAppCode: config.hereAppCode,
                    bingKey: config.bingKey
                });
            }
        })

    });
});

module.exports = router;
