"use strict"

const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	return res.json({
		message: "Selamat Datang Di Dompetku API",
	})
})


module.exports = router