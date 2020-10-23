require("dotenv").config();
console.log(process.env);
$(document).ready(() => {
  const searchForm = $("form#searchArtist"); //hook to signup form
  const artistInput = $("input#artistInput"); //hook to search

  searchForm.on("submit", event => {
    event.preventDefault();
    search(artistInput.val().trim());
  });

  function search(searchTerm) {
    console.log(searchTerm);
    window.location.replace("/search");
  }

  if (window.location.pathname === "/search") {
    $.get("/api/searchArtist/" + artistInput.val().trim()).then(data => {
      searchArtist(data.search);
    });
  }
});
