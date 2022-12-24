const { body } = require('express-validator');

const CreateUserValidator = [
	body('name')
		.notEmpty()
		.withMessage('Name is required')
		.isLength({ min: 3 })
		.withMessage('Name must be at least 3 characters long'),
		
	body('email')
		.notEmpty()
		.withMessage('Email is required')
		.isEmail()
		.withMessage('Email is invalid'),

	body('nohp')
		.notEmpty()
		.withMessage('No HP is required')
		.isLength({ min: 6 })
		.withMessage('No HP must be at least 6 characters long'),

	body('kelamin')
		.notEmpty()
		.withMessage('Kelamin is required'),

	body('kelamin')
		.custom((value) => {
			const kelamin = ['Male', 'Female']
			if (!kelamin.includes(value)) {
				throw new Error('Kelamin must be Male or Female')
			}
			return true
		}),

	body('password')
		.notEmpty()
		.withMessage('Password is required')
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters long'),
]

module.exports = CreateUserValidator;
