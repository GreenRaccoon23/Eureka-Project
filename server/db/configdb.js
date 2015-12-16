var mongoose = require('mongoose');
var db = mongoose.connection;

var userSchema = mongoose.Schema({
	username: String,
	password: String,
	firstname: String,
	lastname: String,
	date: { type: Date, default: Date.now }

});

var linkSchema = mongoose.Schema({
	title: String,
	baseurl: String,
	visits: Number,
	date: { type: Date, default: Date.now }

});

var user = mongoose.model('user', userSchema);
var link = mongoose.model('link', linkSchema);


mongoose.connect('mongodb://localhost:27017');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
	console.log('connection made');
});
