function handle_doSearch(artistInput) {
    if (artistInput.val().length < 2) {
        artistInput.bsValidateError();
        artistInput.focus();
    } else {
        artistInput.bsValidateClear();
        doSearch(artistInput.val());
    }
}