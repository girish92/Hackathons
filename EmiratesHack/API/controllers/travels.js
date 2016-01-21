exports.findAll = function(req, res){
  res.send([{
    "id": 1,
    "destination": "Dubai",
    "type": "Leisure",
    "price": "$3500"
  }]);
  console.log("find all executed")
};
exports.findByDestination = function() {};
exports.findByDestinationPrice = function() {};
//exports.add = function() {};
//exports.update = function() {};
//exports.delete = function() {};
