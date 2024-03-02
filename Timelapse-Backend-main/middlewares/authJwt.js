const jwt = require('jsonwebtoken');
const appConfig = require('../config/app.config.js');

verifyToken = (req, res, next) => {
	// Two options:
	// If you want to accept the token in this header
	let token = req.headers['x-access-token'];
	
	// If you want to accept the token in Authorization Bearer
	// let token = req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' ? req.headers.authorization.split(' ')[1] : null;

	if (!token) {
		return res.status(403).send({ message: 'No token provided!' });
	}

	jwt.verify(token, appConfig.JWT_SIGNING_KEY, (err, decoded) => {
		if (err) {
			return res.status(401).send({ message: 'Unauthorized!' });
		}
		
		// Attach any attributes into the request from the decoded token below
		// req.userId = decoded.id; etc
		req.email = decoded.email;
		req.accessToken = token;
		
		next();
	});
};

const authJwt = {
	verifyToken
};
module.exports = authJwt;