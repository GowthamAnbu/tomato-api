const mongoose = require('mongoose');

    module.exports = (config) => {
        mongoose.connect(config.db);
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error...'));
        db.once('open', () => {
            console.log('tomato db opened');
        });
    };