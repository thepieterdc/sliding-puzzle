(function ($, w) {
    "use strict";

    var EventHandler = function() {
        var self = this;
        self.listeners = {"click_doSearch": [], "click_tileImage": [], "tap_tileImage": [], "press_arrow": []};

        $(document).on("click", "#init_doSearch", function () {
            self.listeners["click_doSearch"].forEach(function (l) {
                l($("#init_artistName"), $("#init_cols"), $("#init_rows"));
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

        $(document).on("keydown", function(e) {
            console.log(e);
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