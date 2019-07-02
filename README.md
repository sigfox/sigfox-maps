# Sigfox-maps

This project is an example of how to use the Sigfox backend API to display your own maps. 

There are 2 layers demonstrated in this project:
- `Public map`
- `Monarch coverage map`

## Technologies

This application is a simple [nodeJs](http://nodejs.org) server application which uses [Express](http://expressjs.com) 
for routing and [Pug](https://pugjs.org) for templating. 
The simple frontend uses [Leaflet](https://leafletjs.com/) to display maps.

## Prerequisites

To run/use this sample project, you will need git and nodejs (at least v8.10.0) installed.

If you really do not want to install git, just hit the download button, to retrieve a tarball of the whole repository. 

## Configuration

To configure properly the application, you need to rename the config.js.sample to config.js and edit this file to provide your own setup.

```javascript
const config = {
    sigfoxApiUser: "yourSigfoxApiUser",
    sigfoxApiPassword: "yourSigfoxApiPassword",
    sigfoxApiSite: "api.sigfox.com",
    publicMapPath: "/v2/tiles/public-coverage",
    monarchMapPath: "/v2/tiles/monarch",
    https: true,
    
    //---- For MapBox background map
    backgroundMapType: "Basic",
    backgroundMap: "https://api.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token={yourToken}"
}
```

In production situation, you should only set your own credentials to access the Sigfox API and set your background map URL according to your map provider.

The example above showcases a [Mapbox](https://www.mapbox.com/) map with a light style (you'll have to set your own token). To sum up, the `backgroundMap` property expects a TMS URL.
You can use other background map providers by switching properties ([Jawg](https://www.jawg.io), [Here](https://developer.here.com/), [Google](https://cloud.google.com/maps-platform) or [Bing](https://www.bingmapsportal.com)).

In test situation, you might want to mock the Sigfox Backend. In order to do this, you can edit the other properties :

- `sigfoxApiSite` to specify the base URL of your mock (including the http(s) prefix)
- `publicMapPath` to specify the endpoint. To provide a compatible endpoint, check the documentation of the Sigfox API v2
- `monarchMapPath` to specify the endpoint. To provide a compatible endpoint, check the documentation of the Sigfox API v2
- `https` to specify if your mock is deployed on https context (set it to true), or http (set it to false)

## How to run

You just have to do a simple : `npm install && npm start`
On Windows the `&&` operator might not work, so, launch in sequence
```
npm install
npm start
```

Open the url <http://localhost:3000/> on your browser.