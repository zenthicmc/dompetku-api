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

async function store(req, res) {
	try {
		const token = decodeJwt(req)
		const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({
					success: false,
					code: 400,
					errors: errors.array()
				});
			}

		const data = {
			user_id: token.sub,
			amount: req.body.amount,
			type: "Withdraw",
			status: "Pending",
			icon: "https://i.ibb.co/5kyV2N6/Withdraw.png",
		}

		const user = await User.findById(token.sub)
		if(user.saldo < req.body.amount) return response400(res, "Saldo anda tidak cukup")

		const withdraw = await Transaction.create(data)
		if(withdraw) {
			user.saldo = parseInt(user.saldo) - parseInt(req.body.amount)
			user.save()

			return res.json({
				success: true,
				code: 200,
				message: "Withdraw berhasil",
				data: withdraw
			})
		}

	} catch (err) {
		return response500(res)
	}
}
		
module.exports = {
	store
}