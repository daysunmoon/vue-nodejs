const db = require('../config/db');

const schema = new db.Schema({
    name:String,
    imgUrl:String,
    score:String,
    starring:String,
    country:String,
    time:String
})
module.exports = db.model('film',schema);