const path = require('path');
const rootPath = path.normalize(__dirname +'/../');

module.exports = {
	development: {
		rootPath: rootPath,
		db: 'mongodb://localhost/tomato',
		port: process.env.PORT || 3030
	}
}