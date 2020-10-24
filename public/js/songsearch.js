$(document).ready(() => {
  const searchSongForm = $("form#searchSong"); //hook to signup form
  const songInput = $("input#songInput"); //hook to search
  let storedSearch = "";

  searchSongForm.on("submit", event => {
    event.preventDefault();
    search(songInput.val().trim());
  });

  function search(searchTerm) {
    console.log(searchTerm);
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

  if (window.location.pathname === "/songsearch") {
    init();
    $.get("/api/searchSong/" + storedSearch).then(response => {
      $("#songName").text(response.strTrack);
      $("#genre").text(response.strGenre);
    });
  }
});
