var FB = require('fb');
FB.api('oauth/access_token', {
    client_id: '787065624747435',	// FB app id
    client_secret: '471b817c92f7b5e110cdf902672ad04c',  // FB app secret
    grant_type: 'client_credentials',

}, function (res) {
    if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
    }
    console.log("Facebook response: ", res);
    // Setting facebook access token
    FB.setAccessToken(res.access_token);
});


exports.get_list_of_songs = function(request, response){
	var ytUrl,
	data = {
		songs: []
	};

	//Make an API requet and get the FB group data from the Graph
	FB.api('534674899917897/feed', function (res) {
	  if(!res || res.error) {
	    console.log(!res ? 'error occurred' : res.error);
	    return;
	  }
	  
	  for(song in res.data){
	  	// save user id number
	  		ytUrl = res.data[song].link;
	  		if(ytUrl.indexOf("www.youtube.com") > -1){
	  			ytUrl = ytUrl.split("=")[1].split("&")[0];
	  			console.log(ytUrl)

	  		}else if(ytUrl.indexOf("youtu.be") > -1){
	  			ytUrl = ytUrl.split(".be/")[1];
	  			console.log(ytUrl)
	  		}
			data.songs.push(new Element( res.data[song].from.id , ytUrl, res.data[song].from.name, res.data[song].name));
	  }
	  response.json(data);
	});
}



function Element(userPic, ytId, name, title){
	this.youtubeVideoId = ytId;
	this.userFacebookPic = 'http://graph.facebook.com/' +  userPic + '/picture';
	this.name = name;
	this.title = title;
}


// FB.api('oauth/access_token', {
//     client_id: '787065624747435',	// FB app id
//     client_secret: '471b817c92f7b5e110cdf902672ad04c',  // FB app secret
//     grant_type: 'client_credentials',

// }, function (res) {
// 	var ytUrl; // Represents a Youtube link

//     if(!res || res.error) {
//         console.log(!res ? 'error occurred' : res.error);
//         return;
//     }
//     console.log(res)
//     FB.setAccessToken(res.access_token);

// 	FB.api('534674899917897/feed', function (res) {
// 	  if(!res || res.error) {
// 	    console.log(!res ? 'error occurred' : res.error);
// 	    return;
// 	  }
	  
// 	  for(song in res.data){
// 	  	if((res.data[song].link.indexOf("youtube.com/watch") > -1) || (res.data[song].link.indexOf("youtu.be") > -1)) {
// 	  		ytUrl = res.data[song].link.split("#",1);
// 			  ytUrl = ytUrl[0].split("&",1);
// 			  ytUrl = ytUrl[0].split("=",1);
// 	  	}
// 	  	console.log(ytUrl[0])
// 	  }
// 	});
// });