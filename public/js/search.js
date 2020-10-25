$(document).ready(() => {
  const searchForm = $("form#searchArtist"); //hook to signup form
  const artistInput = $("input#artistInput"); //hook to search
  let storedSearch = "";

  searchForm.on("submit", event => {
    event.preventDefault();
    search(artistInput.val().trim());
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

  function saveSong(songName) {
    $.post("/api/favoriteSong", {
      song: songName
    })
      .then(() => {
        window.location.replace("/members");
      })
      .catch(handleErr);
  }

  function saveSongLater(songName) {
    $.post("/api/favoriteSongLater", {
      song: songName
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
      const strMusicVid =
        "https://www.youtube.com/embed/" +
        response.strMusicVid.substring(
          response.strMusicVid.indexOf("=") + 1,
          response.strMusicVid.length
        );
      $("#strMusicVid").attr("src", strMusicVid);
      $("#strDescriptionEN").text(response.strDescriptionEN);
    });
    // Event listener for saving a Song Button
    $("#songSaveBtn").on("click", event => {
      event.preventDefault();
      const songData = {
        song: storedSearch
      };
      saveSong(songData.song);
    });
    // Event listener for saving a Song Later Button
    $("#songLaterBtn").on("click", event => {
      event.preventDefault();
      const songData = {
        song: storedSearch
      };
      saveSongLater(songData.song);
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
  }
});
