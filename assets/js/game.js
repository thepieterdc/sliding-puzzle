(function ($, eH, lM) {
    lM.injectLoaders();

    function getPuzzle(artist, cols, rows) {
        console.log(artist);
    }

    function searchArtist(artistInput, colsInput, rowsInput) {
        var artist = artistInput.val(), cols = colsInput.val(), rows = rowsInput.val();
        var valid = true;
        if (artist.length < 2) {
            artistInput.bsValidateError();
            artistInput.focus();
            valid = false;
        }
        if(cols < 2) {
            colsInput.bsValidateError();
            colsInput.focus();
            valid = false;
        }
        if(rows < 2) {
            rowsInput.bsValidateError();
            rowsInput.focus();
            valid = false;
        }

        if(valid) {
            artistInput.bsValidateClear();
            colsInput.bsValidateClear();
            rowsInput.bsValidateClear();
            lM.switch(lM.screens.init, lM.screens.loading, function () {
                $.getJSON(api + "cgi-bin/artist.py", "artist={0}".format(artist), function (resp) {
                    if (resp.success) {
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