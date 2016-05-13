/**
 Created by Pieter De Clercq <pieterdeclercq@outlook.com>.
 **/
(function ($, eH, lM) {
    "use strict";

    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    var puzzle;

    lM.injectLoaders();

    function arrowSwap(colDelta, rowDelta) {
        var c = parseInt(puzzle.position[0]) + colDelta, r = parseInt(puzzle.position[1]) + rowDelta;
        puzzle.swap(puzzle.tile(c, r));
    }

    function clickTile(tableCell) {
        puzzle.swap(tableCell);
    }

    function finish() {
        puzzle.emptyTile().html('<img src="{0}" class="tile-image" data-col="{1}" data-row="{2}" style="width:100%;height:auto" />'.format(puzzle.piece(puzzle.position[0], puzzle.position[1]), puzzle.position[0], puzzle.position[1]));
        lM.screens.game.bsAlert("success", "Congratiulations", "You have solved the puzzle.");
    }

    function getPuzzle(artist, cols, rows) {
        $.ajax({
            data: "artiest={0}&rijen={1}&kolommen={2}".format(artist, rows, cols),
            dataType: "json",
            error: function () {
                lM.switch(lM.screens.game, lM.screens.init, function () {
                    lM.screens.init.bsAlert("danger", "Oh no", "No puzzles were found for this artist.");
                });
            },
            success: function (resp) {
                if (resp.success) {
                    document.title = "Schuifpuzzel :: {0}".format(artist);
                    var tileHolder = $("#game_puzzle").find("tbody");
                    puzzle = new Puzzle(cols, rows, resp.content.directoryname, tileHolder);
                    showPuzzle();
                    puzzle.addSolvedListener(finish);
                    lM.switch(lM.panels.game_puzzle_loading, lM.panels.game_puzzle_puzzle, function () {
                    });
                } else {
                    lM.switch(lM.screens.game, lM.screens.init, function () {
                        lM.screens.init.bsAlert("danger", "Oh no", "No puzzles were found for this artist.");
                    });
                }
            },
            url: "cgi-bin/schuifpuzzel.py"
        });
    }

    function reset() {
        document.title = "Schuifpuzzel";
        puzzle = null;

        lM.switch(lM.screens.game, lM.screens.init, function () {
            $("#game_puzzle").find("tbody").html('');
            $("#game_artistName").html('');
            $("#game_artistInfo").html('');
            $("#game_artistTopTracks").html('').hide();
            $("#game_topTracksPanel").show();
            $("#game_artistTopTracksLoading").show();
        });
    }

    function reShuffle() {
        if (!puzzle.solved) {
            puzzle.shuffle();
        } else {
            lM.screens.game.bsAlert("danger", "Oh no", "You already solved the puzzle.");
        }
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
                $.ajax({
                    data: "artist={0}&autocorrect=1".format(artist),
                    dataType: "json",
                    error: function () {
                        lM.switch(lM.screens.loading, lM.screens.init, function () {
                            artistInput.bsValidateError();
                            artistInput.focus();
                        });
                    },
                    success: function (resp) {
                        if ("error" in resp) {
                            lM.switch(lM.screens.loading, lM.screens.init, function () {
                                artistInput.bsValidateError();
                                artistInput.focus();
                            });
                        } else {
                            lM.switch(lM.screens.loading, lM.screens.game, function () {
                                $("#game_artistName").html(resp.artist.name);
                                $("#game_artistInfo").html(resp.artist.bio.summary);
                                getPuzzle(resp.artist.name, cols, rows);
                                topTracks(resp.artist.name);
                            });
                        }
                    },
                    url: lastFmApi.format("artist.getinfo")
                });
            });
        }
    }

    function showPuzzle() {
        var puzzleRow;
        for (var r = 0; r < puzzle.rows; r += 1) {
            puzzleRow = "";
            for (var c = 0; c < puzzle.cols; c += 1) {
                puzzleRow += '<td class="no-padding" data-col="{0}" data-row="{1}">'.format(c, r);
                if (c !== puzzle.position[0] || r !== puzzle.position[1]) {
                    puzzleRow += '<img src="{0}" class="tile-image" data-col="{1}" data-row="{2}" style="width:100%;height:auto" />'.format(puzzle.piece(c, r), c, r);
                }
                puzzleRow += "</td>";
            }
            puzzle.tileHolder.append("<tr>{0}</tr>".format(puzzleRow));
        }
        puzzle.shuffle();
    }

    function topTracks(artist) {
        var cell, show = 4, topTracksPanel = $("#game_artistTopTracks"), trackInfo;
        $.ajax({
            data: "artist={0}".format(artist),
            dataType: "json",
            error: function () {
                lM.panels.game_toptracks.fadeOut(1000);
            },
            success: function (resp) {
                if ("error" in resp) {
                    lM.panels.game_toptracks.fadeOut(1000);
                } else {
                    console.log(resp);
                    lM.switch($("#game_artistTopTracksLoading"), topTracksPanel, function() {
                        show = resp.toptracks.length < 4 ? resp.toptracks.length : 4;
                        topTracksPanel.html('');
                        for(var i = 0; i < show; i += 1) {
                            trackInfo = resp.toptracks[i];
                            cell = '<div class="col-md-{0}"><img src="" /></div>'.format(12/show);
                            topTracksPanel.append(cell);
                        }
                    });
                }
            },
            url: lastFmApi.format("artist.gettoptracks")
        });
    }

    if (isChrome) {
        lM.screens.init.find(".row").find("div:first").bsAlert("warning", "Attention", "Google Chrome has a small graphical glitch sometimes; please try Mozilla Firefox.", 10000);
    }

    eH.addListener("click_cancel", reset);
    eH.addListener("click_doSearch", searchArtist);
    eH.addListener("click_reShuffle", reShuffle);
    eH.addListener("click_tileImage", clickTile);
    eH.addListener("tap_tileImage", clickTile);
    eH.addListener("press_arrow", arrowSwap);

})(window.jQuery, new EventHandler(), new LayoutManager());
