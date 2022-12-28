"use strict"

const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	nohp: {
		type: String,
		required: true,
		unique: true,
	},
	kelamin: {
		type: String,
		required: true,
		default: 'Male',
	},
	saldo: {
		type: Number,
		default: 0,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		default: 'member',
	},
	image: {
		type: String,
		default: 'https://i.ibb.co/D9Gb6N4/male-removebg-preview.png',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	token: {
		type: String,
	},
})

module.exports = mongoose.model('User', UserSchema)