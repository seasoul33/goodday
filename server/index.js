const db = require('./dbInterface.js')
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const apiRouter = require('./api')
const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  db.init('127.0.0.1:27017');

  app.use(bodyParser.json()) ;
  app.use('/api', apiRouter)

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  // app.listen(port, host)
  app.listen(port, "0.0.0.0")
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
