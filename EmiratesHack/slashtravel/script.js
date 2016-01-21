var res = require("./result.js");

this.getFlightAvailability = function (date_, origin_city_, destination_city_) {

  //var date = encodeURIComponent('11/21/2015');
  //var origin_city = encodeURIComponent('San Jose');
  //var destination_city = encodeURIComponent('Dubai');

  /*var date = encodeURIComponent(date_);
  var origin_city = encodeURIComponent(origin_city_);
  var destination_city = encodeURIComponent(destination_city_);
  var fclass = encodeURIComponent('Economy');

  //var api = 'flightavailability';
  var flight_date = `FlightDate=${date}`;
  var origin = `Origin=${origin_city}`;
  var destination = `Destination=${destination_city}`;
  var flight_class = `Class=${fclass}`;
  var url = `https://ec2-54-77-6-21.eu-west-1.compute.amazonaws.com:8143/flightavailability/1.0/?${flight_date}&${origin}&${destination}&${flight_class}`;

  console.log(url);
  var request = require('request');
  request.get(url, {'rejectUnauthorized': false,
    'auth': {
      'bearer': '4bd2a1f9b36f7cd56c7a3e271eaa9eb8'
    }
  }).on('response', function(response){
    //console.log("SUCCESS!");
    //console.log(response.body);
    var body = resonse.body;
    console.log(response.toJSON());
  });

  if (body == undefined) {
    body = res.flight_availability;
  }
  return body;*/
}

function getFlightMenu(flightNo, date, origin_city, destination_city){

  var flightNo = encodeURIComponent(flightNo);
  var date = encodeURIComponent(date);
  var origin_city = encodeURIComponent(origin_city);
  var destination_city = encodeURIComponent(destination_city);

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
    //console.log(response.body);
    var body = resonse.body;
    console.log(response.toJSON());
  });

  if(body == undefined){
    body = res.flight_menu;
  }
  return body;
}

/*function getBookingDetails(refNo, booking_date, last_name, flight_no, flight_date, boarding){

  var ref_no = encodeURIComponent(ref_no);
  var booking_date = encodeURIComponent(booking_date);
  var last_name = encodeURIComponent(last_name);
  var flight_no = encodeURIComponent(flight_no);
  var flight_date = encodeURIComponent(flight_date);
  var boarding = encodeURIComponent(boarding);

  var api = 'booking';
  var ref_no = `BookingRefNo=${ref_no}`
  var booking_date = `BookingDate=${booking_date}`;
  var flight_date = `FlightDate=${flight_date}`;
  var last_name = `LastName=${last_name}`;
  var flight_num = `FlightNo=${flight_no}`;
  var board = `BoardingPoint=${boarding}`;

  var url = `https://ec2-54-77-6-21.eu-west-1.compute.amazonaws.com:8143/${api}/1.0/?${ref_no}&${booking_date}&${last_name}&${flight_no}&${flight_date}&${flight_no}
  ${flight_num}&${flight_date}&${origin}&${destination}`;

  console.log(url);
  var request = require('request');
  request.get(url, {'rejectUnauthorized': false,
    'auth': {
      'bearer': '4bd2a1f9b36f7cd56c7a3e271eaa9eb8'
    }
  }).on('response', function(response){
    //console.log("SUCCESS!");
    //console.log(response.body);
    var body = resonse.body;
    console.log(response.toJSON());
  });

  if(body == undefined){
    body = res.booking_details;
  }
  return body;
}*/
