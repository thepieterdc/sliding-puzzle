(function ($, eH, lM) {
    var puzzle;

    lM.injectLoaders();

    function getPuzzle(artist, cols, rows) {
        $.getJSON(api + "cgi-bin/puzzle.py", "artiest={0}&rijen={1}&kolommen={2}".format(artist, rows, cols), function (resp) {
            if (resp.success) {
                lM.switch(lM.panels.game_puzzle_loading, lM.panels.game_puzzle_puzzle, function () {
                    puzzle = new Puzzle(cols, rows);
                    puzzle.render($("#game_puzzle").find("tbody"));
                });
            } else {
                alert("no puzzle was found. see issue");
            }
        });
    }

    function searchArtist(artistInput, colsInput, rowsInput) {
        var artist = artistInput.val(), cols = colsInput.val(), rows = rowsInput.val(), valid = true;
        if (artist.length < 2) {
            artistInput.bsValidateError();
            artistInput.focus();
            valid = false;
        }
        if (cols < 2) {
            colsInput.bsValidateError();
            colsInput.focus();
            valid = false;
        }
        if (rows < 2) {
            rowsInput.bsValidateError();
            rowsInput.focus();
            valid = false;
        }

        if (valid) {
            artistInput.bsValidateClear();
            colsInput.bsValidateClear();
            rowsInput.bsValidateClear();
            lM.switch(lM.screens.init, lM.screens.loading, function () {
                $.getJSON(api + "cgi-bin/artist.py", "artist={0}".format(artist), function (resp) {
                    if (resp.success) {
                        lM.switch(lM.screens.loading, lM.screens.game, function () {
                            $("#game_artistName").html(resp.content.name);
                            $("#game_artistInfo").html(resp.content.biography);
                            getPuzzle(resp.content.name, cols, rows);
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