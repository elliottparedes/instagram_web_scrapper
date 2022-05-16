const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    link: {
        type: String
    },
    dateCreated: Date
})

const Image = mongoose.model("instagram_images", imageSchema);

module.exports =Image;