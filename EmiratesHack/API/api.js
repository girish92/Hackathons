

//consumer_key = GmkVr6qtzb_oCdVMzSQ3ktONT4ca
//consumer_secret = Zc6MmB7BRUmChazSBSClBT0YaT8a
//access_token = 4bd2a1f9b36f7cd56c7a3e271eaa9eb8

var flightNo = encodeURIComponent('EK542');
var date = encodeURIComponent('11/21/2015');
var origin_city = encodeURIComponent('San Jose');
var destination_city = encodeURIComponent('Dubai');


var api = 'foodmenu';
var flight_num = `FlightNo=${flightNo}`;
var flight_date = `FlightDate=${date}`;
var origin = `Origin=${origin_city}`;
var destination = `Destination=${destination_city}`;

var url = `https://ec2-54-77-6-21.eu-west-1.compute.amazonaws.com:8143/${api}/1.0/?${flight_num}&${flight_date}&${origin}&${destination}`;

console.log(url);

var request = require('request');
request.get(url, {'rejectUnauthorized': false,
  'auth': {
    'bearer': '4bd2a1f9b36f7cd56c7a3e271eaa9eb8'
  }
}).on('response', function(response){
  //console.log("SUCCESS!");
  console.log(response.body);
  //var body = resonse.body;
  console.log(response.toJSON());
});
