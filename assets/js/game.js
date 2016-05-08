(function ($, eH, lM) {

    function getPuzzle(artist, cols, rows) {
        console.log(artist);
    }

    function searchArtist(artistInput) {
        var artist = artistInput.val();
        if (artist.length < 2) {
            artistInput.bsValidateError();
            artistInput.focus();
        } else {
            artistInput.bsValidateClear();
            lM.switch(lM.screens.init, lM.screens.loading, function () {
                $.getJSON(api + "cgi-bin/artist.py", "artist={0}".format(artist), function (resp) {
                    if (resp.success) {
                        console.log("test");
                        lM.switch(lM.screens.loading, lM.screens.game, function () {
                            $("#game_artistName").html(resp.content.name);
                            $("#game_artistInfo").html(resp.content.biography);
                            getPuzzle(resp.content.name, 2, 2);
                        });
                    } else {
                        lM.switch(lM.screens.loading, lM.screens.init, function () {
                            artistInput.bsValidateError();
                            artistInput.focus();
                        });
                    }
                });
            });
        }
    }

    eH.addListener("click_doSearch", searchArtist);

})(window.jQuery, new EventHandler(), new LayoutManager());