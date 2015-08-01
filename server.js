var express = require('express');
var fbConnection = require('./fbConnection');
var bodyParser = require('body-parser');
// var url = require('url');
var app = express();

// Configurin server
app.use(express.static(process.cwd() + '/public')).listen(process.env.PORT || 8080);
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(function(req,res,next){
	//Setting headers for external requests
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Header", "Origin, X-Requested-With,Content-Type, Accept");
	// res.set("Content-Type", "application/json");
	next();
});


// This will return a list of youtube songs represented as a youtube links
app.get('/getSongsList' , fbConnection.get_list_of_songs );
