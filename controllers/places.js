const express = require('express')
const verifyToken = require('../middleware/verify-token.js')
const Place = require('../models/place.js')
const router = express.Router()

// * ========== Public Routes ===========

// * ========= Protected Routes =========

router.use(verifyToken)


// * ========== PLACES ===========

// * CREATE
router.post('/', async (req, res) => {
  try {
    req.body.user = req.user._id
    const place = await Place.create(req.body)
    place._doc.user = req.user
    return res.status(201).json(place)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
})


// * INDEX
router.get('/', async (req, res) => {
  try {
    const places = await Place.find().populate('user')
    return res.json(places)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
})


// * SHOW
router.get('/:placeId', async (req, res) => {
  try {
    const place = await Place.findById(req.params.placeId)
      .populate('user')
      .populate('comments.user')
      
    if (!place){
      res.status(404)
      throw new Error('Place not found!')
    }
    return res.json(place)
  } catch (error) {
    console.error(error)
    if (res.statusCode === 200) {
      res.status(500)
    }
    return res.json({ error: error.message })
  }
})


// * UPDATE
router.put('/:placeId', async (req, res) => {
  const { placeId } = req.params
  try {
    const place = await Place.findById(placeId)

    // Send 404 if not found
    if (!place){
      res.status(404)
      throw new Error('Place not found!')
    }

    // Check user is authorized to update document (is document user)
    if (!place.user.equals(req.user._id)){
      res.status(403)
      throw new Error('Forbidden')
    }

    // Updating the document
    const updatedPlace = await Place.findByIdAndUpdate(placeId, req.body, { new: true })

    updatedPlace._doc.user = req.user

    return res.json(updatedPlace)

  } catch (error) {
    console.error(error)
    if (res.statusCode === 200) {
      res.status(500)
    }
    return res.json({ error: error.message })
  }
})

// * GET USER'S PLACES
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const userPlaces = await Place.find({ user: userId }).populate('user')
    return res.json(userPlaces)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
})


// * DELETE
router.delete('/:placeId', async (req, res) => {
  const { placeId } = req.params
  try {
    const place = await Place.findById(placeId)

    // Send 404 if not found
    if (!place){
      res.status(404)
      throw new Error('Place not found!')
    }

    // Check user is authorized to update document (is document user)
    if (!place.user.equals(req.user._id)){
      res.status(403)
      throw new Error('Forbidden')
    }

    const deletedPlace = await Place.findByIdAndDelete(placeId)

    return res.json(deletedPlace)
  } catch (error) {
    console.error(error)
    if (res.statusCode === 200) {
      res.status(500)
    }
    return res.json({ error: error.message })
  }
})



// * ========== COMMENTS ===========

router.post('/:placeId/comments', async (req, res) => {
  const { placeId } = req.params
  try {
    
    req.body.user = req.user._id
    
    
    const place = await Place.findById(placeId)

    
    if (!place){
      res.status(404)
      throw new Error('Place not found!')
    }

    
    place.comments.push(req.body)

    
    await place.save()

    
    const newComment = place.comments[place.comments.length - 1]

    
    newComment._doc.user = req.user

    
    return res.status(201).json(newComment)
  } catch (error) {
    console.error(error)
    if (res.statusCode === 200) {
      res.status(500)
    }
    return res.json({ error: error.message })
  }
})


module.exports = router