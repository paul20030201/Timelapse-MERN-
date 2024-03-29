var _ = require('lodash');
// handles single and multiple user responses
users = (users, token = null) => {
	let res = [];
	
	const responseParams = {
		_id: null,
		email: null,
		first_name: null,
		last_name: null,
		is_verified: null,
	};

	if (Array.isArray(users)) {
		let structuredUser = null;
		_.each(users, function(user) {
			structuredUser = _.pick(user, _.keys(responseParams));
			res.push(structuredUser);
		});
		return res;
	} else {
		const structuredUser = _.pick(users, _.keys(responseParams));
		if (token && token != '') {
			structuredUser.accessToken = token
			structuredUser.success = true;
		}
		return structuredUser;
	}
};

const structures = {
	users
};
module.exports = structures;