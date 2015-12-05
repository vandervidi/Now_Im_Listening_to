var dao = require('../dao');
var FB = require('fb');

//	Request an 'Access token' that will allow to use our Facebook app.
//	When a token is received, Set it as the one that is used.
FB.api('oauth/access_token', {
    client_id: '787065624747435',	// Facebook app id
    client_secret: '471b817c92f7b5e110cdf902672ad04c',  // Facebook app secret
    grant_type: 'client_credentials',

}, function (res) {
    if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
    }
    console.log("Facebook response: ", res);

    FB.setAccessToken(res.access_token); //	Setting facebook access token
});

//	This function fetches the latest songs from the facebook group feed
//	and then saves it to the database and sends a list of all songs 
//	to the user in a HTTP response.
exports.get_list_of_songs = function(request, response){
	var ytUrl,
		data = {
			songs: []
		};

	//	Make an API requet and get the Facebook group data from the Graph
	FB.api('534674899917897/feed', function (res) {
	  if(!res || res.error) {
	    console.log(!res ? 'error occurred' : res.error);
	    response.json({status: 0 });
	    return 1;
	  }
	  
	  // Iterate feed posts and extract only youtube 
	  for(song in res.data){
	  	try{
	  		ytUrl = res.data[song].link;
	  		
	  		if(ytUrl.indexOf(".youtube.com") > -1){
	  			ytUrl = ytUrl.split("v=")[1].split("&")[0];
	  		}

	  		else if(ytUrl.indexOf("youtu.be") > -1){
	  			ytUrl = ytUrl.split(".be/")[1];
	  		}
  		}catch(e){
  			// If an error occures with one of the songs, skip to the next one.
  			continue;	
  		}

		data.songs.push(new Element( res.data[song].from.id , ytUrl, res.data[song].from.name, res.data[song].name));
	  }

	  // This function will save all the songs from the feed to the database and then send 
	  // all songs existing in the DB to the user
	  dao.update_db_and_return_all_songs(response, data);

	});
}


//	This object represents a song element
function Element(userPic, ytId, name, title){
	this.youtubeVideoId = ytId;
	this.userFacebookPic = 'http://graph.facebook.com/' +  userPic + '/picture';
	this.name = name;
	this.title = title;
}
