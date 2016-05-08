function EventHandler() {
    var self = this;
    self.listeners = {"click_doSearch": []};

    $(document).on("click", "#init_doSearch", function () {
        self.listeners["click_doSearch"].forEach(function (l) {
            l($("#init_artistName"), $("#init_cols"), $("#init_rows"));
        })
    });

    $(document).on("keydown", "input", function (e) {
        if (e.keyCode == 13) {
            $("a[data-submit={0}]".format($(this).attr('data-form'))).click();
        }
    });
}

EventHandler.prototype.addListener = function (event, listener) {
    this.listeners[event].push(listener);
};