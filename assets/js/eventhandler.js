(function ($, w) {
    "use strict";
    
    var EventHandler = function() {};

    EventHandler.prototype.doSearch = function(artistInput, successCallback) {
        if (artistInput.val().length < 2) {
            artistInput.bsValidateError();
            artistInput.focus();
        } else {
            artistInput.bsValidateClear();
            successCallback(artistInput.val());
        }
    };

    EventHandler.prototype.formSubmit = function(e, formId) {
        if (e.keyCode == 13) {
            $("a[data-submit={0}]".format(formId)).click();
        }
    };

    w.EventHandler = EventHandler;
})(window.jQuery, window);