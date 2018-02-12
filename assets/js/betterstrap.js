/**
Created by Pieter De Clercq <pieterdeclercq@outlook.com>.
**/
(function ($) {
    "use strict";

    $.fn.bsAlert = function (type, strong, msg, delay) {
        var div, identifier = Math.round(Math.random() * 100);
        this.prepend('<div class="alert alert-dismissable alert-'+(type)+'" data-identifier="'+(identifier)+'"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>'+(strong)+'!</strong> '+(msg)+'</div>');
        window.setTimeout(function() {
            div = $("div[data-identifier="+identifier+"]");
            div.fadeOut(1500);
            div.promise().done(function() {
                div.remove();
            });
        }, typeof delay === "undefined" ? 1500 : delay);
    };

    $.fn.bsValidateClear = function () {
        this.parent().removeClass("has-error").removeClass("has-success").removeClass("has-warning");
    };

    $.fn.bsValidateError = function () {
        this.bsValidateClear();
        this.parent().addClass("has-error");
    };
})(window.jQuery);
