"use strict"

require('../config/database')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

async function login(req, res) {
	try {
		const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ 
					success: false,
					code: 400,
					errors: errors.array()
				});
			}

		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
		const user = await User.findOne({
			nohp: req.body.nohp
		})

		if(!user) {
			return res.status(404).send({
				success: false,
				code: 404,
				message: "You're account are not registered"
			});
		}

		const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
		if(!isPasswordValid) {
			return res.status(401).send({
				success: false,
				code: 401,
				message: 'Incorrect password'
			});
		}

		const payload = {
			iss: 'Dompetku',
			sub: user._id,
			aud: ip,
			exp: new Date().setDate(new Date().getDate() + 7),
			iat: new Date().getTime(),
		}

		// generate token
		const token = jwt.sign(payload, process.env.JWT_KEY, { algorithm: 'HS256' });

		// update token in database
		user.token = token;
		await user.save();
		
		return res.status(200).json({
			success: true,
			code: 200,
			message: 'Login success',
			data: {
				token: token
			}
		})

	} catch (err) {
		return res.status(500).json({
			success: false,
			code: 500,
			message: err.message,
		})
	}
}

module.exports = {
	login,
}