$(document).ready(() => {
  const searchForm = $("form#searchArtist"); //hook to signup form
  const artistInput = $("input#artistInput"); //hook to search

  searchForm.on("submit", event => {
    event.preventDefault();
    search(artistInput.val().trim());
  });

  function search(searchTerm) {
    console.log(searchTerm);
    $.post("/api/search", {
      search: searchTerm
    })
      .then(() => {
        window.location.replace("/search");
        // If there's an error, log the error
      })
      .catch(err => {
        console.log(err);
      });
  }

  if (window.location.pathname === "/search") {
    $.get("/api/search").then(data => {
      searchArtist(data.search);
    });
  }

  function searchArtist(artist) {
    const settings = {
      // eslint-disable-next-line prettier/prettier
      "async": true,
      // eslint-disable-next-line prettier/prettier
      "crossDomain": true,
      // eslint-disable-next-line prettier/prettier
      "url": "https://rapidapi.p.rapidapi.com/search.php?s=" + artist,
      // eslint-disable-next-line prettier/prettier
      "method": "GET",
      // eslint-disable-next-line prettier/prettier
      "headers": {
        "x-rapidapi-host": "theaudiodb.p.rapidapi.com",
        "x-rapidapi-key": "951e66441emshfc6c776ab574133p105a72jsnbdc9d6149898"
      }
    };

    $.ajax(settings).done(response => {
      console.log(response);

      const artistName = response.artists[0].strArtist;
      console.log(artistName);
    });
  }
});
