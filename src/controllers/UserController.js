"use strict"

require('../config/database')
const Transaction = require('../models/Transaction')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator');
const { response400, response403, response404, response500 } = require('../helpers/response')
const CheckOwner = require('../middlewares/CheckOwner')
const decodeJwt = require('../helpers/decodeJwt')
const axios = require('axios')
const hmacSHA256 = require('crypto-js/hmac-sha256'); 
const hex = require('crypto-js/enc-hex');

async function show(req, res) {
	try {
		const data = await User.find()
		if(data.length <= 0) return response404(res, "Users not found")

		return res.json({
			success: true,
			code: 200,
			message: "Users fetched successfully",
			data: data
		})

	} catch (err) {
		return response500(res)
	}
}

async function detail(req, res) {
	try {
		const data = await User.findById(req.params.id)
		if(!data) return response404(res, "User with that id is not found")

		return res.json({
			success: true,
			code: 200,
			message: "User Detail fetched successfully",
			data: data
      })

	} catch (err) {
		return response404(res)
	}
}

async function store(req, res) {
	try {
		const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ 
					success: false,
					code: 400,
					errors: errors.array()
				});
			}

		const hashedPassword = await bcrypt.hash(req.body.password, 10)
		const data = {
			name: req.body.name,
			email: req.body.email,
			nohp: req.body.nohp,
			kelamin: req.body.kelamin,
			password: hashedPassword,
			saldo: 50000,
		}

		User.create(data, (err, user) => {
			if(err) {
				return res.status(400).json({
					success: false,
					code: 400,
					message: err.message
				})
			}

			return res.json({
				success: true,
				code: 200,
				message: "User created successfully",
				data: {
					_id: user._id,
				}
			})
		})

	} catch (err) {
		return response500(res)
	}
}

async function update(req, res) {
	try {
		const oldData = await User.findById(req.params.id)

		const data = {
			name: req.body.name || oldData.name,
			email: req.body.email || oldData.email,
			nohp: req.body.nohp 	|| oldData.nohp,
			password: req.body.password || oldData.password
		}

		User.findByIdAndUpdate(req.params.id, data, {new: true}, (err, user) => {
			if(err) {
				return res.status(400).json({
					success: false,
					code: 400,
					message: err.message
				})
			}

			return res.json({
				success: true,
				code: 200,
				message: "User updated successfully",
				data: {
					_id: user._id,
				}
			})
		})

	} catch (err) {
		return response404(res)
	}
}

async function destroy(req, res) {
	try {
		const data = await User.findById(req.params.id)
		await data.remove()

		return res.json({
			success: true,
			code: 200,
			message: "User deleted successfully",
			data: {
				_id: data._id
			}
		})

	} catch (err) {
		return response404(res)
	}
}

async function getprofile(req, res) {
	try {
		const token = decodeJwt(req)
		const user = await User.findById(token.sub).select('name email nohp kelamin saldo createdAt')
		
		const transactions = await Transaction
			.find({user_id: token.sub})
			.sort({created_at: -1})
			.limit(3)

		user.transaction = transactions

		return res.json({
			success: true,
			code: 200,
			message: "User Profile fetched successfully",
			data: {
				user,
				transactions
			}
		})

	} catch (err) {
		return console.log(err)
	}
}

module.exports = {
	show,
	detail,
	store,
	update,
	destroy,
	getprofile
}