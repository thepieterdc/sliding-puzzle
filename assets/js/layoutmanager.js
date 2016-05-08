function LayoutManager() {
}

LayoutManager.prototype.screens = {
    "game": $("#screen_game"),
    "init": $("#screen_init"),
    "loading": $("#screen_loading")
};

LayoutManager.prototype.injectLoaders = function () {
    $(".loadBox").html('<div class="fountainGContainer">' +
        '<div class="fountainG fountainG_1"></div>' +
        '<div class="fountainG fountainG_2"></div>' +
        '<div class="fountainG fountainG_3"></div>' +
        '<div class="fountainG fountainG_4"></div>' +
        '<div class="fountainG fountainG_5"></div>' +
        '<div class="fountainG fountainG_6"></div>' +
        '<div class="fountainG fountainG_7"></div>' +
        '<div class="fountainG fountainG_8"></div>' +
        '</div>');
};

LayoutManager.prototype.switch = function (o, n, callback) {
    o.slideUp();
    o.promise().done(function () {
        callback();
        n.slideDown();
    })
};