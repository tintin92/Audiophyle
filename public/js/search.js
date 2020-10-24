$(document).ready(() => {
  const searchForm = $("form#searchArtist"); //hook to signup form
  const artistInput = $("input#artistInput"); //hook to search
  let storedSearch = "";

  searchForm.on("submit", event => {
    event.preventDefault();
    search(artistInput.val().trim());
  });

  function search(searchTerm) {
    console.log(searchTerm);
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
    $.get("/api/searchArtist/" + storedSearch).then(response => {
      $("#artistName").text(response.strArtist);
      $("#genre").text(response.strGenre);
      $("#yearFormed").text(response.intFormedYear);
      $("#artistPic").text(response.strArtistThumb);
      $("#strFacebook").text(response.strFacebook);
      $("#strFacebook").attr("href", "https://" + response.strFacebook);
      $("#artistWebsite").text(response.strWebsite);
      $("#artistWebsite").attr("href", "https://" + response.strWebsite);
    });
    $.get("/api/artist/" + storedSearch).then(response => {
      console.log();
      const topSongsEl = $("#topSongs");
      for (let i = 0; i < response.length; i++) {
        const liEl = $("<li>");
        liEl.attr("song-id", response[i].idTrack);
        liEl.text(response[i].strTrack);

        topSongsEl.append(liEl);
      }
    });
    $("topSongs").on("click", event => {
      const element = event.target;
      const id = element.getAttribute("song-id");
      songSearch(id);
    });
  } else if (window.location.pathname === "/songsearch") {
    init();
    $.get("/api/searchSong/" + storedSearch).then(response => {
      console.log(response);
    });
  }
});
