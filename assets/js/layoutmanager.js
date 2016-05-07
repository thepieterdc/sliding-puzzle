(function ($) {
    "use strict";

    var LayoutManager = function () {
        this.panels = {
            "game_puzzle_loading": $("#game_panel_puzzle_loading"),
            "game_puzzle_puzzle": $("#game_panel_puzzle_puzzle")
        };
        this.screens = {
            "game": $("#screen_game"),
            "init": $("#screen_init"),
            "loading": $("#screen_loading")
        };
    };

    LayoutManager.prototype.switch = function (o, n, callback) {
        o.slideUp();
        o.promise().done(function () {
            n.slideDown();
            callback();
        })
    }

})(window.jQuery);