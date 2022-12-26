"use strict"

const express = require('express')
const router = express.Router()
const tripayCallback = require('../callback/TripayCallback')

router.post('/tripay', tripayCallback.handle)

module.exports = router