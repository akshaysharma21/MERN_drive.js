const mongoose = require('mongoose');
const GridFS = require('GridFS');

const Schema = mongoose.Schema;

const imageSchema = new mongoose.Schema({
    username: {type: String, required: true},
    imageName: {type: String, required: true},
    imageId: { type: String, required: true, unique: true}
})

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;