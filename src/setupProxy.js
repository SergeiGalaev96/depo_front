const proxy = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/jasperserver',
    proxy({
      target: 'http://server-1:8080',
      // target: 'https://depo.cds.kg',
      changeOrigin: true,
    })
  )
  app.use(
    '/api',
    proxy({
      // target: 'https://d466-77-235-27-71.eu.ngrok.io',
      target: 'http://server-1:44327',
      // target: 'https://depo.cds.kg/back',
      changeOrigin: true,
    })
  )
}