(function ($, w) {
    "use strict";

    var LayoutManager = function() {};

    LayoutManager.panels = {
        "game_puzzle_loading": $("#game_panel_puzzle_loading"),
        "game_puzzle_puzzle": $("#game_panel_puzzle_puzzle")
    };

    LayoutManager.screens = {
        "game": $("#screen_game"),
        "init": $("#screen_init"),
        "loading": $("#screen_loading")
    };

    LayoutManager.prototype.switch = function (o, n, callback) {
        o.slideUp();
        o.promise().done(function () {
            n.slideDown();
            callback();
        })
    };

    w.LayoutManager = LayoutManager;
})(window.jQuery, window);