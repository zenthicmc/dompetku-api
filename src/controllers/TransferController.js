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
			status: "Success",
			type: "Transfer",
		}

		const user = await User.findById(token.sub)
		const receiver = await User.findOne({ nohp : req.body.receiver })

		if(!receiver) return response404(res, "Penerima tidak ditemukan")
		if(user.saldo < req.body.amount) return response400(res, "Saldo anda tidak cukup")

		data.receiver_id = receiver._id
		if(body.catatan) data.catatan = req.body.catatan
		const transfer = Transaction.create(data)
		
		if(transfer) {
			// parseint
			user.saldo = parseInt(user.saldo) - parseInt(req.body.amount)
			receiver.saldo = parseInt(receiver.saldo) + parseInt(req.body.amount)
			
			user.save()
			receiver.save()

			return res.json({
				success: true,
				code: 200,
				message: "Transfer berhasil",
				data: transfer
			})
		}		

	} catch (err) {
		return response500(res)
	}
}
		
module.exports = {
	store
}