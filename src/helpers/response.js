const response401 = (res) => {
	return res.status(401).json({
		success: false,
		code: 401,
		message: 'Unauthorized'
	})
}

const response403 = (res) => {
	return res.status(403).json({
		success: false,
		code: 403,
		message: 'Forbidden'
	})
}

const response500 = (res) => {
	return res.status(500).json({
		success: false,
		code: 500,
		message: 'Internal Server Error'
	})
}

const response404 = (res) => {
	return res.status(404).json({
		success: false,
		code: 404,
		message: 'Not Found'
	})
}

module.exports = {
	response401,
	response403,
	response404,
	response500
}