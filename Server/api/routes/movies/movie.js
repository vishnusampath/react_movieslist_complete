var express = require('express');
var router = express.Router();

var imdbObj = require('node-movie');
var Movie = require('../../../models/movies/movie');

router.route('/movies/add')
    .post(function (req, res) {
      var movie = new Movie();
      movie.Title       =   req.body.addTitle;
      movie.Year        =   req.body.addYear;
      movie.Rated       =   ' ';
      movie.Released    =   req.body.addReleased;
      movie.Runtime     =   ' ';
      movie.Genre       =   req.body.addGenre;
      movie.Director    =   req.body.addDirector;
      movie.Writer      =   ' ';
      movie.Actors      =   req.body.addActors;
      movie.Plot        =   req.body.addPlot;
      movie.Language    =   ' ';
      movie.Country     =   ' ';
      movie.Awards      =   ' ';
      movie.Poster      =   './images/' + req.body.addPoster;
      movie.Metascore   =   ' ';
      movie.imdbRating  =   req.body.addRating;
      movie.imdbVotes   =   ' ';
      movie.imdbID      =   req.body.addID;
      movie.Type        =   ' ';
      movie.Response    =   ' ';
      movie.save(function (err) {
        if(err){
          res.send(err);
        }
        res.json({message: 'Movie Added'});
      });

    });

// Route to get all movies and save a movie
router.route('/movies')
// Get all movies
    .get(function(req, res){
      Movie.find(function(err, movies) {
            if (err)
                res.send(err);
            res.json(movies);
        });
    })
// Search and save the movie
    .post(function(req, res) {
    // Get the new Movie details from omdb-api website
        imdbObj(req.body.Title, function (err, data) {
        if (data.Response !== 'False'){
        var movie = new Movie();
        movie.Title       =   data.Title;
        movie.Year        =   data.Year;
        movie.Rated       =   data.Rated;
        movie.Released    =   data.Released;
        movie.Runtime     =   data.Runtime;
        movie.Genre       =   data.Genre;
        movie.Director    =   data.Director;
        movie.Writer      =   data.Writer;
        movie.Actors      =   data.Actors;
        movie.Plot        =   data.Plot;
        movie.Language    =   data.Language;
        movie.Country     =   data.Country;
        movie.Awards      =   data.Awards;
        movie.Poster      =   data.Poster;
        movie.Metascore   =   data.Metascore;
        movie.imdbRating  =   data.imdbRating;
        movie.imdbVotes   =   data.imdbVotes;
        movie.imdbID      =   data.imdbID;
        movie.Type        =   data.Type;
        movie.Response    =   data.Response;
        movie.save(function(err) {
            if (err){
                res.send(err);
            }
            res.json({ message: 'Movie added!' });
          });
        }
        else {
          res.send(err);
        }
      });
    });
// Route to get all movies and save a movie
    router.route('/movies/:movie_id')
// Get the movie by id
          .get(function(req, res) {
            Movie.findById(req.params.movie_id, function(err, movie) {
                if (err)
                    res.send(err);
                    
                res.json(movie);
            });
          })
// Update the movie by id
          .put(function(req, res) {
            Movie.findById(req.params.movie_id, function(err, movie) {
              if (err)
                  res.send(err);

              movie.Year        =   req.body.updateYear;
              movie.Released    =   req.body.updateReleased;
              movie.Genre       =   req.body.updateGenre;
              movie.Director    =   req.body.updateDirector;
              movie.Actors      =   req.body.updateActors;
              movie.Plot        =   req.body.updatePlot;
              movie.imdbRating  =   req.body.updateimdbRating;

              movie.save(function(err) {
                if (err)
                      res.send(err);
                res.json({ message: 'Movie updated!' });
              });
            });
          })
// Delete the movie by id
          .delete(function(req, res) {
            Movie.remove({
              _id: req.params.movie_id
            }, function(err, movie) {
                if (err)
                  res.send(err);
                res.json({ message: 'Successfully deleted' });
              });
          });

module.exports= router;
