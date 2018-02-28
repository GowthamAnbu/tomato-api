const path = require('path');
const rootPath = path.normalize(__dirname +'/../');

module.exports = {
	development: {
		rootPath: rootPath,
		db: 'mongodb://192.168.7.117:27017/tomato',
		port: process.env.PORT || 3030
	}
}