"use strict"

require('../config/database')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator');
const { response404, response500 } = require('../helpers/response')

async function show(req, res) {
	try {
		const data = await User.find()
		if(data.length <= 0) return response404(res)

		return res.json({
			succes: true,
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
		if(!data) return response404(res)

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
			password: hashedPassword,
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
		const data = await User.findByIdAndDelete(req.params.id)
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


module.exports = {
	show,
	detail,
	store,
	update,
	destroy
}