const Amongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const { serializeError } = require('serialize-error')
const totp = require('totp-generator')
const schema = require('./schema')
dotenv.config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

/**
 * Error logger and serializer
 * @param {ErrorEvent} err
 * @returns Object
 */
const errored = err => {
  console.error(new Date(), err)
  return serializeError(err)
}

// front page
app.all('/', (req, res) => {
  res.type('txt')
  if (req.query && !isNaN(req.query.time)) {
    // get ping
    res.send((Date.now() - req.query.time).toString())
  } else {
    res.send('404 Not Found  ​​​​​​​​​​​​​​​​​​')
  }
})

// authorization
app.use('/*', (req, res, next) => {
  const token = req.get('authorization')
  if (token !== totp(process.env.TOTP_KEY)) return res.status(403).json({ error: 'Error 403: Forbidden lol' })
  next()
})

app.all('/:collectionName', async (req, res) => {
  const { body, method, params } = req
  const Schema = schema(params.collectionName) // collection

  // methods
  const reply = {}
  if (method === 'GET') {
    // get the whole collection
    await Schema.find().then(result => {
      if (result.length) {
        reply.status = 'exists'
        reply.data = result
      } else {
        reply.status = 'empty'
      }
    }).catch(err => { reply.error = errored(err) })
  } else if (method === 'POST') {
    // add new data
    await new Schema({ t: body.time || Date.now(), d: body.data }).then(() => {
      reply.status = 'done'
      console.log(new Date(), 'Added new data for', params.collectionName)
    }).catch(err => { reply.error = errored(err) })
  } else {
    return res.status(404)
  }

  // send result
  reply.time = Date.now()
  res.send(reply)
})

app.all('/:collectionName/ids', async (req, res) => {
  const { method, params } = req
  const Schema = schema(params.collectionName) // collection

  // methods
  const reply = {}
  if (method === 'GET') {
    // get all ids of the collection
    await Schema.find().distinct('_id').then(result => {
      if (result.length) {
        reply.status = 'exists'
        reply.data = result
      } else {
        reply.status = 'empty'
      }
    }).catch(err => { reply.error = errored(err) })
  } else {
    return res.status(404)
  }

  // send result
  reply.time = Date.now()
  res.send(reply)
})

app.all('/:collectionName/:objectId', async (req, res) => {
  const { method, params } = req
  const { collectionName, objectId } = params
  const Schema = schema(collectionName) // collection

  // check if objectId is valid
  if (!objectId) return res.status(404)

  // methods
  const reply = {}
  if (method === 'GET') {
    // get the whole collection
    await Schema.findOne({ _id: objectId }).then(result => {
      if (result) {
        reply.status = 'exists'
        reply.data = result
      } else {
        reply.status = 'empty'
      }
    }).catch(err => { reply.error = errored(err) })
  } else if (method === 'DELETE') {
    // delete
    await Schema.findOne({ _id: objectId }).then(async result => {
      if (result) {
        reply.status = 'exists'
        await Schema.deleteOne({ _id: objectId })
      } else {
        reply.status = 'empty'
      }
    }).catch(err => { reply.error = errored(err) })
  } else {
    return res.status(404)
  }

  // send result
  reply.time = Date.now()
  res.send(reply)
})

app.listen(3000, async () => {
  await Amongoose.connect(process.env.MONGO_URI, { keepAlive: true })
  console.log(new Date(), 'Server is up 🚀')
})
