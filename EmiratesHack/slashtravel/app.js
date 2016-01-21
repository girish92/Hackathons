/*eslint-env node*/

var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
//var flightInfo = require('./script.js');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

var with_val = "";
var plan_name = "";
var destination_val = "";
var budget_val = "";
var arrive_by = "";
var return_by = "";
var airline_val = {};
var class_val = {};
var hotel_val = {};

var plans = {};
var currentPlan = {};
var preferences = {
  airlines: 'none',
  'flightClass': 'economy',
  food: 'vegetarian',
  seatPosition: 'window',
};

var flight_availability = {
  "FlightAvailabilityList": [
    {
      "FlightNo": "EK542",
      "FlightDateTime": "23:12",
      "Sector": "Commercial Asia",
      "TransitsStations": {
        "TransitsStation": [
          "Doha"
        ]
      },
      "Duration": "12h",
      "FlightFare": "1000AED",
      "Currency": "AED"
    },
    {
      "FlightNo": "EK545",
      "FlightDateTime": "09:12",
      "Sector": "Commercial Asia",
      "TransitsStations": {
        "TransitsStation": [
          ""
        ]
      },
      "Duration": "12h",
      "FlightFare": "1200AED",
      "Currency": "AED"
    }
  ]
};

function getFlightAvailablity() {
	return flight_availability;
}

function getValueSettingFunction(result_to_set) {
	return /* @callback */ function(input, user) {
		if (input.length === 0) {
			return {"text": result_to_set};
		} else {
			result_to_set = input;
			return {"text": "Done"};
			//return {"text": result_to_set};
		}
	};
}

function getValueSettingForUserFunction(result_to_set) {
	return /* @callback */ function(input, user) {
		if (input.length === 0) {
			return {"text": result_to_set[user]};
		} else {
			result_to_set[user] = input;
			return {"text": "Done"};
		}
	};
}

function getAlwaysDoneFunction(input, user) {
	return {"text": "Done"};
}

function setFlight(input, user) {
  var flight = input.split(' ');
  flight = flight[flight.length - 1];
	return {"text": "Selected Flight ReservationID: "+ flight};
}

function setHotel(input, user) {
  var hotel = input.split(' ');
  hotel = hotel[hotel.length - 1];
	return {"text": "Selected Hotel ReservationID: "+ hotel};
}

function bookStuff(input, user) {
	return {"text": "Flight and Hotel booked"};
}

function setPlan(input, user) {
  input = input.replace('trip', '').trim();
  var title;
  var color;
  var plan;
  if (input.length === 0) {
    plan = plans[user];
    if (!plan) {
      return {"text": 'No plans. Create one with "/travel plan [name]"'};
    }
    title = 'Plan';
    color = 'warning';
	} else {
    title = 'New Plan';
    color = 'danger';
    currentPlan = plan = plans[user] = {
      title: input + ' trip'
    };
	}
	return {
    "text": title,
    "attachments": [
      {
        title: plan.title,
        color: color,
      },
      getDestinationAttachment(),
      getDatesAttachment(),
      getParticipantsAttachment(),
      getBudgetAttachment()
    ]
  };
}

function planAll(input, user) {
  input = input.replace('trip', '').trim();
  var title;
  var color;
  var plan = {
    title: 'Dubai Trip',
    destination: 'Dubai',
    dates: {
      from: '12/7',
      to: '12/11'
    }
  };

  title = 'New Plan';
  color = 'danger';
  currentPlan = plans[user] = plan;
	return {
    "text": title,
    "attachments": [
      {
        title: plan.title,
        color: color,
      },
      getDestinationAttachment(),
      getDatesAttachment(),
      getParticipantsAttachment(),
      getBudgetAttachment()
    ]
  };
}

function setDestination(input, user) {
  input = input.replace('destination').trim();
  var destination;
  if (!currentPlan) {
    return {"text": 'No plans. Create one with "/travel plan [name]"'};
  }
  if (input.length === 0) {
    destination = currentPlan.destination;
    if (!destination) {
      return {"text": 'No destination. Set one with "/travel destination [name]"'};
    }
	} else {
    currentPlan.destination = input;
	}
	return {
    "text": "Plan: Trip Destination",
    "attachments": [
      getDestinationAttachment()
    ]
  };
}

function getDestinationAttachment() {
  var destination = currentPlan.destination || 'none';
  return {
    title: 'Destination',
    text: destination
  };
}

function setBudget(input, user) {
  input = input.replace('budget', '').trim().split(' ');
  var budget;
  if (!currentPlan) {
    return {"text": 'No plans. Create one with "/travel plan [name]"'};
  }
  if (input.length || !input[0]) {
    budget = input[input.length - 1];
    if (budget[0] === '$') {
      budget = budget.slice(1);
    }
    budget = parseInt(budget, 10);
    if (!budget) {
      budget = currentPlan.budget;
    } else {
      currentPlan.budget = budget;
    }
	} else {
    budget = currentPlan.budget
	}
  if (!budget) {
    return {"text": 'No budget. Set one with "/travel budget $[amount]"'};
  }
	return {
    "text": "Plan: Trip Budget",
    "attachments": [
      getBudgetAttachment()
    ]
  };
}

function getBudgetAttachment() {
  var budget = currentPlan.budget;
  if (!budget) {
    return {
      title: 'Budget for Dubai Trip',
      text: 'no budget set',
    };
  }
  return {
    title: 'Budget for Dubai Trip',
    text: 'status',
    "fields": [
      {
        "title": "Per Person",
        "value": '$' + budget,
        "short": true
      }
    ]
  };
}

// work in progress!
function setParticipants(input, user) {
  input = input.replace('participants', '').split(', ').join(',').trim()
                .split('@').join('').trim().split(' ').join(',').split(',');
  var participants;
  if (!currentPlan) {
    return {"text": 'No plans. Create one with "/travel plan [name]"'};
  }
  if (input.length === 0 || !input[0]) {
    participants = currentPlan.participants;
    if (!participants) {
      return {"text": 'No participants. Add them with "/travel participants [names]"'};
    }
	} else {
    participants = currentPlan.participants = input;
	}

	return {
    "text": "Plan: Trip Participants",
    "attachments": [
      getParticipantsAttachment()
    ]
  };
}

function getParticipantsAttachment() {
  var participants = currentPlan.participants || [];
  return {
    title: 'Trip Participants',
    text: !participants.length ? 'none' : participants.length + ' participants',
    fields: participants.map(function (username) {
      return {
        title: 'Going',
        value: '@' + username,
        short: true,
        // color: 'danger',
      }
    })
  };
}

function setDates(input, user) {
  var dates = {
    from: '12/7',
    to: '12/11'
  };
  if (!currentPlan) {
    return {"text": 'No plans. Create one with "/travel plan [name]"'};
  }

  currentPlan.dates = dates;

	return {
    "text": "Plan: Trip Dates",
    "attachments": [
      getDatesAttachment()
    ]
  };
}

function getDatesAttachment() {
  var dates = currentPlan.dates;
  if (!dates) {
    return {
      title: 'Dates',
      fields: [
        {
          title: 'from',
          value: 'none',
          color: 'danger',
          short: true
        },
        {
          title: 'to',
          value: 'none',
          color: 'danger',
          short: true
        },
      ]
    }
  }
  return {
    title: 'Dates',
    fields: [
      {
        title: 'from',
        value: dates.from,
        color: 'good',
        short: true
      },
      {
        title: 'to',
        value: dates.to,
        color: 'good',
        short: true
      },
    ]
  }
}

function getPreferences(input, user) {
  var prefs = preferences;
  // if (!currentPlan) {
  //   return {"text": 'No plans. Create one with "/travel plan [name]"'};
  // }

	return {
    "text": "User Trip Preferences",
    "attachments": [
      {
        title: user + ' preferences',
        fields: [
          {
            title: 'airline',
            value: prefs.airlines,
            short: true,
          },
          {
            title: 'flight class',
            value: prefs.flightClass,
            short: true,
          },
          {
            title: 'food',
            value: prefs.food,
            short: true,
          },
          {
            title: 'seat position',
            value: prefs.seatPosition,
            short: true,
          },
        ]
      }
    ]
  };
}

function getBudgetHistory(input, user) {
  var plan = plans[user];
  if (!plan) {
    return {"text": 'No plans. Create one with "/travel plan [name]"'};
  }
  return {
    "text": "Plan: Budget History",
    "attachments": [
      {
        title: 'budget history for ' + currentPlan.destination,
    		// "color": "#36a64f",
    		"image_url": "http://slashtravelteam.mybluemix.net/images/average-price-per-annum.jpg"
      }
    ]
  };
}

function setAirline(input, user) {
  input = input.replace('airline', '').trim();
  preferences.airlines = input;
  return {
    "text": "Updated Prefered Airline",
    "attachments": [
      {
        title: 'Airline',
        text: input,
      }
    ]
  };
}

function getBudgetOverall(input, user) {
  var plan = plans[user];
  if (!plan) {
    return {"text": 'No plans. Create one with "/travel plan [name]"'};
  }
  return {
    "text": "Plan: Overall Budget",
    "attachments": [
      {
        title: 'Overall budget for ' + currentPlan.title,
    		"color": "good",
    		"image_url": "http://slashtravelteam.mybluemix.net/images/overall-budget.jpg"
      }
    ]
  };
}

function finalizePlan(input, user) {
  var plan = plans[user];
  if (!plan) {
    return {"text": 'No plans. Create one with "/travel plan [name]"'};
  }
  return {
    "response_type": "in_channel",
    "text": "plan finalized",
    "attachments": [
      {
        title: plan.title,
        color: 'good',
      },
      getDestinationAttachment(),
      getDatesAttachment(),
      getParticipantsAttachment(),
      getBudgetAttachment(),
    ]
  };
}


function getArrivalStatus() {
  return {
    "text": "Arrival Status",
    "attachments": [
      {
        "color": "#36a64f ",
        "title": "Elissa Muller",
       "title_link": "https://www.facebook.com/elissa.m.lim?fref=ts",
       "pretext": "ETA: Arrived 12/07/2015 23:45",
        "thumb_url": "http://slashtravelteam.mybluemix.net/images/elissa.jpg"
      },
      {
        "color": "#ffff00 ",
        "title": "Poornima V",
       "title_link": "https://www.facebook.com/poornima94?fref=ts",
       "pretext": "ETA: Delayed 12/08/2015 01:20",
        "thumb_url": "http://slashtravelteam.mybluemix.net/images/poornima.jpg"
      },
      {
        "color": "#ff0000 ",
        "title": "Girish M",
       "title_link": "https://www.facebook.com/girish.narayanan.75",
       "pretext": "ETA: On Time 12/07/2015 23:55",
        "thumb_url": "http://slashtravelteam.mybluemix.net/images/girish.jpg"
      }
    ]
  };
}

function getSearchFlightFunction(input, user) {
	var attachments = [];
	/*
	var info = getFlightAvailablity("11/21/2015", "San Jose", "Dubai")["FlightAvailabilityList"];
	var prev = "San Jose";
	var curr = "";
	for (var i = 0; i < info.length; ++i) {
		if (i === info.length - 1) {
			curr = "Dubai";
		} else {
			curr = "Doha";
		}
		var attachment = {"color": "#36a64f"};
		attachment["text"] = prev + " -> " + curr + ", " + info[i]["FlightDateTime"] + ", " + info[i]["Duration"];
		attachments.push(attachment);

		if (i === 0) {
			prev = "Doha";
		}
	}*/

	attachments.push({
		"color": "#36a64f",
		"title": "San Francisco -> Dubai			ReservationID: EK71227J",
		"title_link": "http://fly10.emirates.com/CAB/IBE/ResultByPrice.aspx",
		"fields": [
              {
                  "title": "Date Time",
                  "value": "12/07/2015 14:05",
                  "short": true
              },
              {
                  "title": "Duration",
                  "value": "15hrs 45mins",
                  "short": true
              },
              {
                  "title": "Class",
                  "value": "Economy",
                  "short": true
              },
              {
                  "title": "Price",
                  "value": "from USD 1531",
                  "short": true
              }
          ],
          "thumb_url": "http://slashtravelteam.mybluemix.net/images/emirates-logo.jpg"
	},{
		"color": "#ffff00",
		"title": "San Francisco -> Dubai			ReservationID: JEG6551P",
		"title_link": "http://fly10.emirates.com/CAB/IBE/ResultByPrice.aspx",
		"fields": [
              {
                  "title": "Date Time",
                  "value": "12/07/2015 21:55",
                  "short": true
              },
              {
                  "title": "Duration",
                  "value": "17hrs 25mins",
                  "short": true
              },
              {
                  "title": "Class",
                  "value": "Economy",
                  "short": true
              },
              {
                  "title": "Price",
                  "value": "from USD 1831",
                  "short": true
              }
          ],
          "thumb_url": "http://slashtravelteam.mybluemix.net/images/emirates-logo.jpg"
	},{
		"color": "#ff0000",
		"title": "San Francisco -> Dubai			ReservationID: AW8721L",
		"title_link": "http://fly10.emirates.com/CAB/IBE/ResultByPrice.aspx",
		"fields": [
              {
                  "title": "Date Time",
                  "value": "12/07/2015 19:20",
                  "short": true
              },
              {
                  "title": "Duration",
                  "value": "15hrs 30mins",
                  "short": true
              },
              {
                  "title": "Class",
                  "value": "Business",
                  "short": true
              },
              {
                  "title": "Price",
                  "value": "from USD 17,172",
                  "short": true
              }
          ],
          "thumb_url": "http://slashtravelteam.mybluemix.net/images/emirates-logo.jpg"
	});

	return {"text": "Best Available Flights", "attachments": attachments};
}

function getSearchHotelFunction(input, user) {
	var attachments = [];
	attachments.push({
		"color": "#36a64f",
		"title": "AirBnb Luxury High Rise: $104			ReservationID: EK71227",
    	"title_link": "https://www.airbnb.com/rooms/7613558?s=tOkVoG0z",
		"image_url": "http://slashtravelteam.mybluemix.net/images/airbnb2.jpeg"
	},
  {
		"color": "#ffff00",
		"title": "AirBnb Executive Studio: $127			ReservationID: EK71228",
    	"title_link": "https://www.airbnb.com/rooms/9123207?s=tOkVoG0z",
		"image_url": "http://slashtravelteam.mybluemix.net/images/airbnb.jpeg"
	},
  {
		"color": "#ff0000",
		"title": "AirBnb Harbour King: $150				ReservationID: EK71229",
    	"title_link": "https://www.airbnb.com/rooms/9021203?s=tOkVoG0z",
		"image_url": "http://slashtravelteam.mybluemix.net/images/airbnb3.jpeg"
	});
	return {"text": "Best Available Hotels", "attachments": attachments};
}

// function getSearchHotelImageFunction() {
// 	return /* @callback */ function(input, user) {
// 		return {
//       "text": "Hotel Results",
//       "attachments": [
//         {
//           "title": "AirBnb Executive Studio: $127",
//           "title_link": "https://airbnb.com",
//   	      "image_url": "http://slashtravelteam.mybluemix.net/images/airbnb.png",
//           "color": "#764FA5"
//         },
//         {
//           "title": "AirBnb Luxury High Rise: $104",
//           "title_link": "https://www.airbnb.com/rooms/9123207?s=tOkVoG0z",
//   	      "image_url": "http://slashtravelteam.mybluemix.net/images/airbnb2.png",
//           "color": "#764FA5"
//         },
//         {
//           "title": "AirBnb Harbour King: $150",
//           "title_link": "https://airbnb.com",
//           "image_url": "http://slashtravelteam.mybluemix.net/images/airbnb3.png",
//           "color": "#764FA5"
//         }
//       ]
//     };
//   };
// }

var cmds = [
  {cmd: "plan dubai trip to dubai", cb: planAll},
  {cmd: "finalize plan", cb: finalizePlan},
  {cmd: "plan finalize", cb: finalizePlan},
  {cmd: "arrival status", cb: getArrivalStatus},
  {cmd: "airline", cb: setAirline},
  {cmd: "plan", cb: setPlan},
	{cmd: "with", cb: getValueSettingFunction(with_val)},
  {cmd: "destination", cb: setDestination},
  {cmd: "participants", cb: setParticipants},
  {cmd: "budget history", cb: getBudgetHistory},
  {cmd: "overall budget", cb: getBudgetOverall},
  {cmd: "budget overall", cb: getBudgetOverall},
  {cmd: "set budget per person to", cb: setBudget},
  {cmd: "set budget", cb: setBudget},
  {cmd: "book flight and hotel", cb: bookStuff},
  {cmd: "from", cb: setDates},
  {cmd: "budget", cb: setBudget},
  {cmd: "set flight", cb: setFlight},
  {cmd: "set hotel", cb: setHotel},
	{cmd: "set", cb: getAlwaysDoneFunction},
	{cmd: "arrive by", cb: getValueSettingFunction(arrive_by)},
	{cmd: "return by", cb: getValueSettingFunction(return_by)},
	{cmd: "airline", cb: getValueSettingForUserFunction(airline_val)},
	{cmd: "class", cb: getValueSettingForUserFunction(class_val)},
	{cmd: "hotel", cb: getValueSettingForUserFunction(hotel_val)},
	{cmd: "search flight", cb: getSearchFlightFunction},
  {cmd: "search hotel", cb: getSearchHotelFunction},
  // {cmd: "hotel_img", cb: getSearchHotelImageFunction()},
	{cmd: "book", cb: getAlwaysDoneFunction},
	{cmd: "auto", cb: getAlwaysDoneFunction},
  {cmd: "preferences", cb: getPreferences},
];

app.get('/',  /* @callback */ function (req, res) {
  res.send('Hello World!');
});

app.post('/travel', upload.array(),  /* @callback */ function(req, res, next) {
	var data = req.body.text;
	var user_name = req.body.user_name;
	// var cmd_found = false;
  var length = cmds.length;
  var cmd;
	for (var i=0; i<length; i++) {
    cmd = cmds[i];
		if (data.indexOf(cmd.cmd) === 0) {
			// cmd_found = true;
			var cob = cmd.cb;
			if (data.indexOf(" ") === -1) {
				return res.json(cob("", user_name));
			} else {
				return res.json(cob(data.slice(data.indexOf(" ") + 1), user_name));
			}
		}
	}

  res.send({text: "UNKNOWN cmd: " + data});
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
