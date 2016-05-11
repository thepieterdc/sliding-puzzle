(function ($) {
    "use strict";

    $.fn.bsAlert = function (type, strong, msg, delay) {
        var div, identifier = Math.round(Math.random() * 100);
        this.prepend('<div class="alert alert-dismissable alert-{0}" data-identifier="{1}"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>{2}!</strong> {3}</div>'.format(type, identifier, strong, msg));
        setTimeout(function() {
            div = $("div[data-identifier={0}]".format(identifier));
            div.fadeOut(1500);
            div.promise().done(function() {
                div.remove();
            });
        }, typeof delay !== "undefined" ? delay : 1500);
    };

    $.fn.bsValidateClear = function () {
        this.parent().removeClass("has-error").removeClass("has-success").removeClass("has-warning");
    };

    $.fn.bsValidateError = function () {
        this.bsValidateClear();
        this.parent().addClass("has-error");
    };
})(window.jQuery);