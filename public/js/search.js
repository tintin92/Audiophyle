$(document).ready(() => {
  const searchForm = $("form#searchArtist"); //hook to signup form
  const artistInput = $("input#artistInput"); //hook to search
  let storedSearch = "";

  searchForm.on("submit", (event) => {
    event.preventDefault();
    search(artistInput.val().trim());
  });

  function search(searchTerm) {
    storedSearch = searchTerm;
    localStorage.setItem("storedSearch", JSON.stringify(storedSearch));
    window.location.replace("/search");
  }

  function songSearch(searchTerm) {
    storedSearch = searchTerm;
    localStorage.setItem("storedSearch", JSON.stringify(storedSearch));
    window.location.replace("/songsearch");
  }

  function init() {
    const storedSearches = JSON.parse(localStorage.getItem("storedSearch"));
    if (storedSearches !== null) {
      storedSearch = storedSearches;
    }
  }

  if (window.location.pathname === "/search") {
    init();
    $.get("/api/searchArtist/" + storedSearch).then((response) => {
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

      $.get("/api/artist/" + storedSearch).then((response) => {
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
    $("#topSongs").on("click", (event) => {
      const element = event.target;
      const id = element.getAttribute("song-id");
      songSearch(id);
    });
  } else if (window.location.pathname === "/songsearch") {
    init();
    $.get("/api/searchSong/" + storedSearch).then((response) => {
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
  } else if (window.location.pathname === "/") {
    $.get("/api/top20/" + storedSearch).then((response) => {
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
    $("#top20").on("click", (event) => {
      const element = event.target;
      const id = element.getAttribute("song-id");
      songSearch(id);
    });
  }
});
