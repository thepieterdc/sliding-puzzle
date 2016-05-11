(function ($) {
    "use strict";

    $.fn.bsAlert = function (type, strong, msg) {
        this.prepend('<div class="alert alert-dismissable alert-{0}"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>{1}!</strong> {2}</div>'.format(type, strong, msg));
    };

    $.fn.bsValidateClear = function () {
        this.parent().removeClass("has-error").removeClass("has-success").removeClass("has-warning");
    };

    $.fn.bsValidateError = function () {
        this.bsValidateClear();
        this.parent().addClass("has-error");
    };
})(window.jQuery);