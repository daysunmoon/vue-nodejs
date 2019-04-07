const db = require('../config/db');

const schema = new db.Schema({
  userName:String,
  filmName:String,
  time:String,
  seating:String
})
module.exports = db.model('order',schema);