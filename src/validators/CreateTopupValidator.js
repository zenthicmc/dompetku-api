const { body } = require('express-validator');

const CreateTopupValidator = [
	body('receiver').notEmpty().withMessage('Receiver Phone is required'),

	body('product_code')
		.notEmpty()
		.withMessage('Product Code is required'),
]

module.exports = CreateTopupValidator;
