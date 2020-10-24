// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const axios = require("axios");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  app.get("/api/searchArtist/:artistName", (req, res) => {
    const options = {
      method: "GET",
      url: "https://rapidapi.p.rapidapi.com/search.php",
      params: { s: req.params.artistName },
      headers: {
        "x-rapidapi-host": "theaudiodb.p.rapidapi.com",
        "x-rapidapi-key": process.env.API_KEY
      }
    };

    axios
      .request(options)
      .then(response => {
        const artist = response.data.artists[0];
        console.log(artist);

        res.json(artist);
      })
      .catch(error => {
        console.error(error);
      });
  });

  app.get("/api/searchArtist/:genre", (req, res) => {
    const options = {
      method: "GET",
      url: "https://rapidapi.p.rapidapi.com/search.php",
      params: { s: req.params.genre },
      headers: {
        "x-rapidapi-host": "theaudiodb.p.rapidapi.com",
        "x-rapidapi-key": process.env.API_KEY
      }
    };

    axios
      .request(options)
      .then(response => {
        const genre = response.data.artists[0];
        console.log(genre);

        res.json(genre);
      })
      .catch(error => {
        console.error(error);
      });
  });

  app.get("/api/searchArtist/:yearFormed", (req, res) => {
    const options = {
      method: "GET",
      url: "https://rapidapi.p.rapidapi.com/search.php",
      params: { s: req.params.yearFormed },
      headers: {
        "x-rapidapi-host": "theaudiodb.p.rapidapi.com",
        "x-rapidapi-key": process.env.API_KEY
      }
    };

    axios
      .request(options)
      .then(response => {
        const yearFormed = response.data.artists[0];
        console.log(yearFormed);

        res.json(yearFormed);
      })
      .catch(error => {
        console.error(error);
      });
  });

  app.get("/api/searchArtist/:artistPic", (req, res) => {
    const options = {
      method: "GET",
      url: "https://rapidapi.p.rapidapi.com/search.php",
      params: { s: req.params.artistPic },
      headers: {
        "x-rapidapi-host": "theaudiodb.p.rapidapi.com",
        "x-rapidapi-key": process.env.API_KEY
      }
    };

    axios
      .request(options)
      .then(response => {
        const artistPic = response.data.artists[0];
        console.log(artistPic);

        res.json(artistPic);
      })
      .catch(error => {
        console.error(error);
      });
  });

  app.get("/api/searchArtist/:artistWebsite", (req, res) => {
    const options = {
      method: "GET",
      url: "https://rapidapi.p.rapidapi.com/search.php",
      params: { s: req.params.artistWebsite },
      headers: {
        "x-rapidapi-host": "theaudiodb.p.rapidapi.com",
        "x-rapidapi-key": process.env.API_KEY
      }
    };

    axios
      .request(options)
      .then(response => {
        const artistWebsite = response.data.artists[0];
        console.log(artistWebsite);

        res.json(artistWebsite);
      })
      .catch(error => {
        console.error(error);
      });
  });

  // ============= Song Search ========================

  app.get("/api/searchSong/:songName", (req, res) => {
    const options = {
      method: "GET",
      url: "https://rapidapi.p.rapidapi.com/searchtrack.php",
      params: { t: req.params.songName },
      headers: {
        "x-rapidapi-host": "theaudiodb.p.rapidapi.com",
        "x-rapidapi-key": process.env.API_KEY
      }
    };

    axios
      .request(options)
      .then(response => {
        const song = response.data.track[0];
        console.log(song);

        res.json(song);
      })
      .catch(error => {
        console.error(error);
      });
  });

  app.get("/api/searchSong/:genre", (req, res) => {
    const options = {
      method: "GET",
      url: "https://rapidapi.p.rapidapi.com/searchtrack.php",
      params: { t: req.params.genre },
      headers: {
        "x-rapidapi-host": "theaudiodb.p.rapidapi.com",
        "x-rapidapi-key": process.env.API_KEY
      }
    };

    axios
      .request(options)
      .then(response => {
        const genre = response.data.track[0];
        console.log(genre);

        res.json(genre);
      })
      .catch(error => {
        console.error(error);
      });
  });

  // app.get("/api/searchSong/:artistPic", (req, res) => {
  //   const options = {
  //     method: "GET",
  //     url: "https://rapidapi.p.rapidapi.com/searchtrack.php",
  //     params: { t: req.params.artistPic },
  //     headers: {
  //       "x-rapidapi-host": "theaudiodb.p.rapidapi.com",
  //       "x-rapidapi-key": process.env.API_KEY
  //     }
  //   };

  //   axios
  //     .request(options)
  //     .then(response => {
  //       const artistPic = response.data.track[0];
  //       console.log(artistPic);

  //       res.json(artistPic);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // });

  app.get("/api/searchSong/:artistWebsite", (req, res) => {
    const options = {
      method: "GET",
      url: "https://rapidapi.p.rapidapi.com/searchtrack.php",
      params: { t: req.params.artistWebsite },
      headers: {
        "x-rapidapi-host": "theaudiodb.p.rapidapi.com",
        "x-rapidapi-key": process.env.API_KEY
      }
    };

    axios
      .request(options)
      .then(response => {
        const artistWebsite = response.data.track[0];
        console.log(artistWebsite);

        res.json(artistWebsite);
      })
      .catch(error => {
        console.error(error);
      });
  });
};
