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
const MD5 = require('crypto-js/md5');

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
			type: "Topup",
		}

		const user = await User.findById(token.sub)
		if(user.saldo < req.body.amount) return response400(res, "Saldo anda tidak cukup")

		const api_key = process.env.IAK_API_KEY
		const api_user = process.env.IAK_USERNAME
		const ref_id = "REF-" + Date.now()
		const sign = MD5(api_user + api_key + ref_id).toString();

		// post to https://prepaid.iak.dev/api/top-up with raw body
		const topup = await axios.post('https://prepaid.iak.dev/api/top-up', {
			customer_id: req.body.receiver,
			product_code: req.body.product_code,
			ref_id: ref_id,
			username: api_user,
			sign: sign
		}, {
			headers: {
				'Content-Type': 'application/json',
				"Accept-Encoding": "gzip,deflate,compress",
			}
		})

		if(topup.data.data.message == "PROCESS") {
			data.status = "Pending"
			data.reference = ref_id
			data.amount = topup.data.data.price

			const transaction = await Transaction.create(data)

			user.saldo = parseInt(user.saldo) - parseInt(topup.data.data.price)
			user.save()

			return res.json({
				success: true,
				code: 200,
				message: "Topup berhasil",
				data: transaction
			})
		}

	} catch (err) {
		console.log(err)
	}
}
		
module.exports = {
	store
}