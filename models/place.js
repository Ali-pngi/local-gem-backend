const mongoose = require('mongoose')

// * Comment Schema
const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// * Place Schema
const placeSchema = new mongoose.Schema({
  placeName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  comments: [commentSchema]
}, {
  timestamps: true
})

const Place = mongoose.model('Place', placeSchema)

module.exports = Place