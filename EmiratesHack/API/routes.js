module.exports = function(app){
    var travels = require('./controllers/travels');
    app.get('/travels', travels.findAll);

    //app.get('/travel/:destination', travels.findByDestination);
    //app.get('/travels/:price', travels.findByDestinationPrice);
    //app.post('/musicians', musicians.add);
    //app.put('/musicians/:id', musicians.update);
    //app.delete('/musicians/:id', musicians.delete);
}


/*

app.get('/travel/:destination', function(req, res) {

   // Get /travel/Dubai
   console.log(req.params.destination)
   // => Dubai

   res.send('{"id": 1,"destination":"Dubai","type":"leisure"}');
});

*/
