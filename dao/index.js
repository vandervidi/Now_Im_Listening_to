var mongoose = require('mongoose');
//	configuring connection to mongoLab
mongoose.connect('mongodb://vandervidi:vandervidi87@ds029793.mongolab.com:29793/heroku_x8jh81jv');

//	import schema module
var songSchema = require('./songSchema').songSchema;

//	configure the imported schema as a model and give it an alias
var Song = mongoose.model('SongM' , songSchema);
var conn = mongoose.connection;

//	Print error message 
conn.on('error', function(err){
	console.log('connection error:' + err);
});


//	This function inserts new songs into the data base and returns the client
//	the list of all songs from the database
exports.update_db_and_return_all_songs = function(res, data){
	//	Number of songs elements in the array
	var dataLen = data.songs.length -1;

	//	This will iterate as the number of songs are retrieved from facebook
	//	Then it will push the ones that do are not in the database.
	//	Then it will return the client the whole songs database in a descending order
	for(var i = dataLen; i >= 0; i--){
		// Insert new songs into the database
		Song.update({	
			'url': data.songs[i].youtubeVideoId,
			'publishedBy': data.songs[i].name			
		},{
			'url': data.songs[i].youtubeVideoId,
			'publishedBy': data.songs[i].name,
			'title': data.songs[i].title,
			'profilePic': data.songs[i].userFacebookPic
		}, {upsert: true}, function(err, doc) {
		  if (err) {
		    console.log('got an error in findOneAndUpdate');
		  }
		});

		//	When the last element is reached , send with the response object 
		//	the list of all songs
		if(i==0){
			Song.find().sort({'_id' : -1}).exec( function(err, songs){
				if(err){
					console.log("Error in find query", err);
					res.json({success: 0});
				}
				res.json({success: 1, songs: songs});
			});
		}
	};

};

//	once a connection is initiated - do the following
conn.once('open' , function(){
	console.log('connected successfully to MongoLab');
});

//	When the node preocess is terminated (Ctrl+c is pressed) , close the connection to the DB.
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});