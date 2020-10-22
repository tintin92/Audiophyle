$(document).ready(() => {
  const searchForm = $("form#searchArtist"); //hook to signup form
  const artistInput = $("input#artistInput"); //hook to search

  searchForm.on("submit", event => {
    event.preventDefault();
    search(artistInput.val().trim());
  });

  function search(artist) {
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
        "x-rapidapi-key": process.env.API_KEY
      }
    };

    $.ajax(settings).done(response => {
      console.log(response);

      const artistName = response.artists[0].strArtist;
      console.log(artistName);
    });
  }
});
