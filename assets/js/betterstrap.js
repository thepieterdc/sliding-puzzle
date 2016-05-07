(function ($) {
    "use strict";

    $.fn.bsValidateClear = function () {
        this.parent().removeClass("has-error").removeClass("has-success").removeClass("has-warning");
    };

    $.fn.bsValidateError = function () {
        this.bsValidateClear();
        this.parent().addClass("has-error");
    };
})(window.jQuery);