var mongoose = require('mongoose');
var schema = mongoose.Schema;
/*
* Configuring a playlist DB schema
*/
var songSchema = new schema({
	
	url: {type: String, required: true},
	publishedBy: {type: String, required: true},
	title: {type: String, required: true},
	profilePic: {type: String, required: true}
}, {collection: 'songs'});

exports.songSchema = songSchema;