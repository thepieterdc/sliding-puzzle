function LayoutManager() {
}

LayoutManager.prototype.screens = {
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