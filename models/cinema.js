const db = require('../config/db');

const schema = new db.Schema({
    name:String,
    address:String,
    price:String,
    distance:String
})

module.exports = db.model('cinema',schema);