"use strict"

const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')
const CreateUserValidator = require('../validators/CreateUserValidator')

router.get('/getprofile', userController.getprofile)
router.get('/getstats', userController.getStats)

router.get('/', userController.show)
router.get('/:id', userController.detail)
router.post('/', CreateUserValidator, userController.store)
router.put('/:id', userController.update)
router.delete('/:id', userController.destroy)

module.exports = router