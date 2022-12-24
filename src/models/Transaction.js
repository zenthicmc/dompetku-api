"use strict"

const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	receiver_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	reference : {
		type: String,
	},
	amount: {
		type: Number,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	catatan: {
		type: String,
	},
	status: {
		type: String,
		default: 'Pending',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('Transaction', TransactionSchema)