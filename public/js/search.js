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
    });
  }
});
