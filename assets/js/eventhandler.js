/**
 Created by Pieter De Clercq <pieterdeclercq@outlook.com>.
 **/
(function ($, w) {
    "use strict";

    var EventHandler = function () {
        var self = this;
        self.listeners = {
            "click_cancel": [],
            "click_doSearch": [],
            "click_playTrack": [],
            "click_reShuffle": [],
            "click_tileImage": [],
            "tap_tileImage": [],
            "press_arrow": []
        };

        $(document).on("click", "#init_doSearch", function () {
            self.listeners["click_doSearch"].forEach(function (l) {
                l($("#init_artistName"), $("#init_cols"), $("#init_rows"));
            });
        });

        $(document).on("click", "#game_btnCancel", function () {
            self.listeners["click_cancel"].forEach(function (l) {
                l();
            });
        });

        $(document).on("click", ".tracklist_doshow", function () {
            var $this = $(this);
            self.listeners["click_playTrack"].forEach(function (l) {
                l($this.attr('data-artist'), $this.attr('data-song'), $this.closest("div.panel"));
            });
        });

        $(document).on("click", "#game_btnReShuffle", function () {
            self.listeners["click_reShuffle"].forEach(function (l) {
                l();
            });
        });

        $(document).on("click", ".tile-image", function () {
            var $this = $(this);
            self.listeners["click_tileImage"].forEach(function (l) {
                l($this.parent("td"));
            })
        });

        $(document).on("keydown", "input", function (e) {
            if (e.keyCode == 13) {
                $("a[data-submit={0}]".format($(this).attr('data-form'))).click();
            }
        });

        $(document).on("keydown", function (e) {
            if (e.keyCode >= 37 && e.keyCode <= 40) {
                e.preventDefault();
                var cD = [1, 0, -1, 0], rD = [0, 1, 0, -1];
                self.listeners["press_arrow"].forEach(function (l) {
                    l(cD[e.keyCode - 37], rD[e.keyCode - 37]);
                });
            }
        });

        $(document).on("touchmove", ".tile-image", function () {
            var $this = $(this);
            self.listeners["tap_tileImage"].forEach(function (l) {
                l($this.parent("td"));
            })
        });
    };

    EventHandler.prototype.addListener = function (event, listener) {
        this.listeners[event].push(listener);
    };

    w.EventHandler = EventHandler;
})(window.jQuery, window);
