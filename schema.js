const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  t: Number, // timestamp
  d: mongoose.Mixed // data
}, { versionKey: false })

module.exports = name => mongoose.model(name, schema)
