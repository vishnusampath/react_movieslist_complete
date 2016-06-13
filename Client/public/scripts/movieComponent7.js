var {Router, Route, IndexRoute, Link, browserHistory } = ReactRouter

var MainLayout = React.createClass({
  render: function () {
    return(
      <div className="container" id="main">
        <NavigationBar />
        <main>
          {this.props.children}
        </main>
      </div>
    );
  }
});

var NavigationBar = React.createClass({
  render: function () {
    return(
      <div className="navbar navbar-fixed-top">
        <div classname="container" id="navbar">
          <div className="navbar-collapse collapse navbar-responsive-collapse">
            <ul className="nav navbar-nav" id="navbar-list">
              <li className="active"><Link to="/home">Home</Link></li>
              <li><Link to="/movies">Movies</Link></li>
              <li><Link to="/addmovie">Add Movie</Link></li>
              <li><Link>Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

var Home = React.createClass({
  render: function () {
    return(
      <div className="row" id="homeBox">
        <div className="col-md-12">
          <div className="jumbotron">
            <h2>Welcome!!</h2>
            <p>Movies to Watch before You DIE</p>
            <p>
              You will find the list here &nbsp;
              <Link to="/movies" className="btn btn-primary">Click Here</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
});

var MainBox = React.createClass({

  getInitialState: function () {
    return {
      movieJSONArray: []
    };
  },

  loadMovie: function(){
    $.get('/api/movies', function (result) {

    this.setState({  movieJSONArray: result
              });
      }.bind(this));
  },

  movieWillDelete: function (movie_ID) {
    $.ajax({
      type: 'DELETE',
      url: '/api/movies/' + movie_ID,
      success: function (result) {
        this.loadMovie();
      }.bind(this)
    })
  },

  componentDidMount: function () {
    this.loadMovie();
    setInterval(this.loadMovie, 6000);
  },

  render: function () {
    return(
      <div className="container" id="mainBox">
        <SearchBox />
        <MovieBox jsonData = {this.state.movieJSONArray} onMovieDelete={this.movieWillDelete} />
      </div>
    );
  }
});

var SearchBox = React.createClass({
  getInitialState: function () {
    return {
      searchText: ''
    };
  },

  componentDidMount: function () {

    $('#searchSave').on('click', function(){
      $.ajax({
        type:'POST',
        url: '/api/movies',
        data: jQuery.param({Title: $('#searchBox').val()}),
        cache: false,
        success: function (data) {

        }
      });
    });
  },

  render: function () {
    return(
      <div className="row wrap-content">
        <form role="form">
          <input id="searchBox" type="text" name="Title" className="form-control" placeholder="Enter Movie Name" />
        </form>
        <button id="searchSave" className="btn btn-primary form-control">Search and Save</button>
      </div>
    );
  }
});

var MovieBox = React.createClass({
  handleDelete: function (movie_ID) {
    return this.props.onMovieDelete(movie_ID);
  },

  render: function () {
    var movierows = [];
    this.props.jsonData.forEach(function (movie){
       movierows.push(<Movie key={movie.imdbID} movieObj={movie} movieID={movie._id} onChooseDelete={this.handleDelete} />);
     }.bind(this));

    return(<div>{movierows}</div>);
  }
});

var Movie = React.createClass({
  handleDeleteClick: function () {
    var movie_ID = this.props.movieID;
    return this.props.onChooseDelete(movie_ID);
  },

  render: function(){

      return(
        <div className="row wrap-content" id="movieElement">
          <div className="col-md-4">
             <img id="poster" alt="Bootstrap Image Preview" src={this.props.movieObj.Poster} />
          </div>
          <div className="col-md-8">
            <div className="list-group" id="list-group">
              <div className="list-group-item" id="list-group-item">
                <ul className="list-unstyled" id="ulist">
                  <li id="name">
                    <span>Title :  </span> {this.props.movieObj.Title}
                  </li>

                  <li id="year">
                    <span>Year :  </span> {this.props.movieObj.Year}
                  </li>

                  <li id="actors">
                    <span>Actors :  </span> {this.props.movieObj.Actors}
                  </li>

                  <li id="director">
                    <span>Director :  </span> {this.props.movieObj.Director}
                  </li>

                  <li id="genre">
                    <span>Genre :  </span> {this.props.movieObj.Genre}
                  </li>

                  <li id="plot">
                    <span>Plot :  </span> {this.props.movieObj.Plot}
                  </li>

                  <li id="released">
                    <span>Released :  </span> {this.props.movieObj.Released}
                  </li>

                  <li id="rating">
                    <span>Rating :  </span> {this.props.movieObj.imdbRating}
                  </li>
                </ul>
                <input type="text" id="movieID" value={this.props.movieObj._id} hidden readOnly />
                <div className="buttons">
                  <a className="btn btn-primary" role="button" href={'http://www.imdb.com/title/' + this.props.movieObj.imdbID}  target="_blank"> View on IMDB </a>
                  <button className="btn btn-warning">Update</button>
                  <button className="btn btn-danger" id="deleteMovie" onClick={this.handleDeleteClick} >Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
});

var AddMovieBox = React.createClass({
  componentDidMount: function(){
    $('#addMovieButton').on('click', function () {

      $.ajax({
        type: 'POST',
        url: 'api/movies/add',
        data: $('#addForm').serialize() + '&addPoster=' + $('#addPoster').val(),
        cache: false,
        success: function () {
          alert("Your Movie has been Added");
        }
      })
    });
  },

  render: function () {
    return(
      <div className="row" id="addMovieBox">
        <div className="col-md-3 pull-left"></div>
    		<div className="col-md-6 jumbotron">
    			<form role="form" id="addForm">
            <div className="form-group">

              <label for="addTitle">
                Title
              </label><br/>
              <input type="text" className="form-control" id="addTitle" name="addTitle" />

            </div>
            <div className="form-group">

              <label for="addYear">
                Year
              </label>
              <input type="text" className="form-control" id="addYear" name="addYear" />

            </div>
    				<div className="form-group">

    					<label for="addActors">
    						Actors
    					</label>
    					<input type="text" className="form-control" id="addActors" name="addActors" />

    				</div>
    				<div className="form-group">

              <label for="addDirector">
                Director
              </label>
              <input type="text" className="form-control" id="addDirector" name="addDirector" />

    				</div>
            <div className="form-group">

              <label for="addGenre">
                Genre
              </label>
              <input type="text" className="form-control" id="addGenre" name="addGenre" />

    				</div>
            <div className="form-group">

    					<label for="addPlot">
    						Plot
    					</label>
    					<input type="text" className="form-control" id="addPlot" name="addPlot" />

    				</div>
            <div className="form-group">

    					<label for="addReleased">
    						Released
    					</label>
    					<input type="text" className="form-control" id="addReleased" name="addReleased" />

    				</div>
    				<div className="form-group">

              <label for="addRating">
                Rating
              </label>
              <input type="text" className="form-control" id="addRating" name="addRating" />

    				</div>
            <div className="form-group">

              <label for="addID">
                Movie ID
              </label>
              <input type="text" className="form-control" id="addID" name="addID" />

    				</div>
            <div className="form-group">

              <label for="addPoster">
                Upload Poster
              </label>
              <input type="file" className="form-control" id="addPoster" name="addPoster" />

    				</div>
    			</form>
          <center>
          <button className="btn btn-primary" id="addMovieButton">
            Add New Movie
          </button>
          </center>
    		</div>
        <div className="col-md-3"></div>
    	</div>
    );
  }

});

var browserHistory = ReactRouter.browserHistory;
ReactDOM.render(
  (
    <Router history={browserHistory}>
      <Route path="/" component={MainLayout}>
        <IndexRoute component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/movies" component={MainBox} />
        <Route path="/addmovie" component={AddMovieBox} />
      </Route>
    </Router>
  ), document.getElementById('content')
);
