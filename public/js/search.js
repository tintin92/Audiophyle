$(document).ready(() => {
  const searchForm = $("form#searchArtist"); //hook to signup form
  const artistInput = $("input#artistInput"); //hook to search
  let storedSearch = "";

  searchForm.on("submit", event => {
    event.preventDefault();
    search(artistInput.val().trim());
  });
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
  });

  function search(searchTerm) {
    storedSearch = searchTerm;
    // Using local storage to save the search since the page will be changed.
    // This way we don't lose what the search was since search.js will run again on the new page.
    localStorage.setItem("storedSearch", JSON.stringify(storedSearch));
    window.location.replace("/search");
  }

  function songSearch(searchTerm) {
    storedSearch = searchTerm;
    // Using local storage to save the search since the page will be changed.
    // This way we don't lose what the search was since search.js will run again on the new page.
    localStorage.setItem("storedSearch", JSON.stringify(storedSearch));
    window.location.replace("/songsearch");
  }

  function init() {
    // Storing the saved search into the variable used in all the functions.
    const storedSearches = JSON.parse(localStorage.getItem("storedSearch"));
    if (storedSearches !== null) {
      storedSearch = storedSearches;
    }
  }

  function saveSong(songId, songName) {
    $.post("/api/favoriteSong", {
      song: songId,
      songName: songName
    })
      .then(() => {
        window.location.replace("/members");
      })
      .catch(handleErr);
  }

  function saveSongLater(songId, songName) {
    $.post("/api/favoriteSongLater", {
      song: songId,
      songName: songName
    })
      .then(() => {
        window.location.replace("/members");
      })
      .catch(handleErr);
  }

  function saveArtist(artistName) {
    $.post("/api/favoriteArtist", {
      artist: artistName
    })
      .then(() => {
        window.location.replace("/members");
      })
      .catch(handleErr);
  }

  function deleteArtist(artistName) {
    $.post("/api/deleteArtist", {
      artist: artistName
    })
      .then(() => {
        window.location.replace("/members");
      })
      .catch(handleErr);
  }

  function deleteSong(songId) {
    console.log("2nd");
    console.log(songId);
    $.post("/api/deleteSong", {
      song: songId
    })
      .then(() => {
        window.location.replace("/members");
      })
      .catch(handleErr);
  }

  function deleteSongLater(songId) {
    $.post("/api/deleteSongLater", {
      song: songId
    })
      .then(() => {
        window.location.replace("/members");
      })
      .catch(handleErr);
  }

  function updateSong(songId) {
    console.log("2nd");
    console.log(songId);
    $.post("/api/updateSong", {
      song: songId
    })
      .then(() => {
        window.location.replace("/members");
      })
      .catch(handleErr);
  }

  function updateSongLater(songId) {
    $.post("/api/updateSongLater", {
      song: songId
    })
      .then(() => {
        window.location.replace("/members");
      })
      .catch(handleErr);
  }

  function handleErr(err) {
    console.log("error");
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }

  if (window.location.pathname === "/search") {
    // The init will make it so storedSearch is filled with what the user searched
    init();
    // This function will make the axios request to the audio DB API and return the artist's info.
    // The returned info will be used to append the info to he page.
    $.get("/api/searchArtist/" + storedSearch).then(response => {
      $("#strArtistThumb").attr("src", response.strArtistThumb);
      $("#strArtist").text("Artist: " + response.strArtist);
      $("#strGenre").text("Genre: " + response.strGenre);
      $("#strMood").text("Mood: " + response.strMood);
      $("#strFacebook").text(response.strFacebook);
      $("#strFacebook").attr("href", "https://" + response.strFacebook);
      $("#strLastFMChart").text(response.strLastFMChart);
      $("#strLastFMChart").attr("href", "https://" + response.strLastFMChart);
      $("#artistWebsite").text(response.strWebsite);
      $("#artistWebsite").attr("href", "https://" + response.strWebsite);
      $("#strBiographyEN").text(response.strBiographyEN);

      // This function will make the axios request to the audioDB API and return the artist's top songs.
      // The returned info will be used to create the top songs list.
      $.get("/api/artist/" + storedSearch).then(response => {
        const topSongsEl = $("#topSongs");
        const topTextEl = $("#topText");
        topTextEl.text("Top " + response.length);
        for (let i = 0; i < response.length; i++) {
          const liEl = $("<li>");
          liEl.attr("song-id", response[i].idTrack);
          liEl.addClass("topSongItem");
          liEl.text(response[i].strTrack);

          topSongsEl.append(liEl);
        }
      });
    });
    // Creates a dynamic event listener for the entire Top Songs list.
    // So you can click on any of the songs in the list and it'll do the search.
    $("#topSongs").on("click", event => {
      const element = event.target;
      const id = element.getAttribute("song-id");
      songSearch(id);
    });
    // Event listener for saving an Artist Button
    $("#artistSaveBtn").on("click", event => {
      event.preventDefault();
      const artistData = {
        artist: storedSearch
      };
      saveArtist(artistData.artist);
    });
  } else if (window.location.pathname === "/songsearch") {
    // The init will make it so storedSearch is filled with what the user searched
    init();
    // This function will make the axios request to the audioDB API and return all info about the song.
    // The returned info will be used to append the info to he page.
    $.get("/api/searchSong/" + storedSearch).then(response => {
      $("#strTrackThumb").attr("src", response.strTrackThumb);
      $("#strTrack").text("Song: " + response.strTrack);
      $("#strArtist").text("Artist: " + response.strArtist);
      $("#strAlbum").text("Album: " + response.strAlbum);
      $("#strGenre").text("Genre: " + response.strGenre);
      let strMusicVid = "";
      if (response.strMusicVid !== null) {
        strMusicVid =
          "https://www.youtube.com/embed/" +
          response.strMusicVid.substring(
            response.strMusicVid.indexOf("=") + 1,
            response.strMusicVid.length
          );
      }
      $("#strMusicVid").attr("src", strMusicVid);
      $("#strDescriptionEN").text(response.strDescriptionEN);
      // Event listener for saving a Song Button
      $("#songSaveBtn").on("click", event => {
        event.preventDefault();
        const songData = {
          song: storedSearch,
          songName: response.strTrack
        };
        saveSong(songData.song, songData.songName);
      });
      // Event listener for saving a Song Later Button
      $("#songLaterBtn").on("click", event => {
        event.preventDefault();
        const songData = {
          song: storedSearch,
          songName: response.strTrack
        };
        saveSongLater(songData.song, songData.songName);
      });
    });
  } else if (window.location.pathname === "/") {
    // This function will make an axios request to the audioDB API and return the top50 songs.
    // The returned info will be used up to 20 of the songs and be appended to the page in a list.
    $.get("/api/top20/" + storedSearch).then(response => {
      const topSongsEl = $("#top20");
      const loadingEl = $("#loading");
      for (let i = 0; i < 20; i++) {
        const liEl = $("<li>");
        liEl.attr("song-id", response[i].idTrack);
        liEl.addClass("topSongItem");
        liEl.text(response[i].strTrack + " - " + response[i].strArtist);

        topSongsEl.append(liEl);
      }
      loadingEl.remove();
    });
    // Creates a dynamic event listener for the entire Top Songs list.
    // So you can click on any of the songs in the list and it'll do the search.
    $("#top20").on("click", event => {
      const element = event.target;
      const id = element.getAttribute("song-id");
      songSearch(id);
    });
  } else if (window.location.pathname === "/members") {
    $.get("/api/savedArtists").then(data => {
      const savedArtists = $("#savedArtists");
      for (let i = 0; i < data.length; i++) {
        const liEl = $("<li>");
        liEl.text(data[i].artist);

        const viewButton = $("<button>");
        viewButton.text("View");
        viewButton.attr("data-artist", data[i].artist);
        viewButton.addClass("savedArtistsViewBtn");
        liEl.append(viewButton);

        const deleteButton = $("<button>");
        deleteButton.text("Delete");
        deleteButton.attr("data-artist", data[i].artist);
        deleteButton.attr("data-id", data[i].userId);
        deleteButton.addClass("savedArtistsDeleteBtn");
        liEl.append(deleteButton);

        savedArtists.append(liEl);
      }
      $(".savedArtistsViewBtn").on("click", event => {
        const element = event.target;
        const artist = element.getAttribute("data-artist");
        search(artist);
      });
      $(".savedArtistsDeleteBtn").on("click", event => {
        const element = event.target;
        const artist = element.getAttribute("data-artist");
        deleteArtist(artist);
      });
    });
    // Getting the user's favorite songs from the DB
    $.get("/api/savedSongs").then(data => {
      const savedArtists = $("#savedSongs");
      for (let i = 0; i < data.length; i++) {
        if (data[i].later === false) {
          const liEl = $("<li>");
          liEl.text(data[i].songName);

          const viewButton = $("<button>");
          viewButton.text("View");
          viewButton.attr("data-song", data[i].song);
          viewButton.addClass("savedSongsViewBtn");
          liEl.append(viewButton);

          const laterButton = $("<button>");
          laterButton.text("Later");
          laterButton.attr("data-song", data[i].song);
          laterButton.attr("data-id", data[i].userId);
          laterButton.addClass("savedSongsLaterBtn");
          liEl.append(laterButton);

          const deleteButton = $("<button>");
          deleteButton.text("Delete");
          deleteButton.attr("data-song", data[i].song);
          deleteButton.attr("data-id", data[i].userId);
          deleteButton.addClass("savedSongsDeleteBtn");
          liEl.append(deleteButton);

          savedArtists.append(liEl);
        }
      }
      $(".savedSongsViewBtn").on("click", event => {
        const element = event.target;
        const id = element.getAttribute("data-song");
        songSearch(id);
      });
      $(".savedSongsDeleteBtn").on("click", event => {
        const element = event.target;
        const song = element.getAttribute("data-song");
        console.log(song);
        deleteSong(song);
      });
      $(".savedSongsLaterBtn").on("click", event => {
        const element = event.target;
        const song = element.getAttribute("data-song");
        console.log(song);
        updateSong(song);
      });
    });
    // Getting the user's listen to later songs from the DB
    $.get("/api/savedSongsLater").then(data => {
      const savedArtists = $("#savedSongsLater");
      for (let i = 0; i < data.length; i++) {
        if (data[i].later === true) {
          const liEl = $("<li>");
          liEl.text(data[i].songName);

          const viewButton = $("<button>");
          viewButton.text("View");
          viewButton.attr("data-song", data[i].song);
          viewButton.addClass("savedSongsLaterViewBtn");
          liEl.append(viewButton);

          const saveButton = $("<button>");
          saveButton.text("Save");
          saveButton.attr("data-song", data[i].song);
          saveButton.attr("data-id", data[i].userId);
          saveButton.addClass("savedSongsLaterSaveBtn");
          liEl.append(saveButton);

          const deleteButton = $("<button>");
          deleteButton.text("Delete");
          deleteButton.attr("data-song", data[i].song);
          deleteButton.attr("data-id", data[i].userId);
          deleteButton.addClass("savedSongsLaterDeleteBtn");
          liEl.append(deleteButton);

          savedArtists.append(liEl);
        }
      }
      $(".savedSongsLaterViewBtn").on("click", event => {
        const element = event.target;
        const id = element.getAttribute("data-song");
        songSearch(id);
      });
      $(".savedSongsLaterDeleteBtn").on("click", event => {
        const element = event.target;
        const song = element.getAttribute("data-song");
        deleteSongLater(song);
      });
      $(".savedSongsLaterSaveBtn").on("click", event => {
        const element = event.target;
        const song = element.getAttribute("data-song");
        updateSongLater(song);
      });
    });
  }
});
