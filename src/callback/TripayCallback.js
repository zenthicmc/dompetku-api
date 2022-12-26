"use strict"

require('../config/database')
const User = require('../models/User')
const Transaction = require('../models/Transaction')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const hmacSHA256 = require('crypto-js/hmac-sha256'); 
const hex = require('crypto-js/enc-hex');
const { response400, response403, response404, response500 } = require('../helpers/response')

async function handle(req, res) {
	const apiKey = process.env.TRIPAY_API_KEY;
	const json = req.body;
	const signature = hmacSHA256(json, apiKey).toString(hex);
	const callbackSignature = req.headers['x-callback-signature']
	const privateKey = process.env.TRIPAY_PRIVATE_KEY
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

	if(!json) {
		return res.status(400).json({
			success: false,
			code: 400,
			message: 'Invalid data sent by payment gateway'
		});
	}

	if ('payment_status' !== req.headers['x-callback-event']) {
		return res.status(400).json({
			success: false,
			code: 400,
			message: 'Unrecognized callback event: ' + req.headers['x-callback-event']
		});
	}

	const uniqueRef = json.merchant_ref
	const status = json.status.toUpperCase()

	if (json.is_closed_payment === 1) {
		const result = await Transaction.findOne({ merchant_ref: uniqueRef })

		if (!result) {
			return res.status(400).json({
				success: false,
				code: 400,
				message: 'Invoice not found or already paid: ' + uniqueRef
			});
		}

		switch (status) {
			case 'PAID':
				result.status = 'Success'
				result.save()
				break;
			case 'EXPIRED':
				result.status = 'Expired'
				result.save()
				break;
			case 'UNPAID':
				result.status = 'Unpaid'
				result.save()
			case 'FAILED':
				result.status = 'Failed'
				result.save()
				break;
			default:
				return res.status(400).json({
					success: false,
					code: 400,
					message: 'Unrecognized payment status'
				});
		}

		return res.status(200).json({
			success: true
		});
	}
}

module.exports = {
	handle
}