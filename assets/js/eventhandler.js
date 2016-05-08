$(document).on("click", "#init_doSearch", function() {
    Game.searchArtist($("#init_artistName"));
});

$(document).on("keydown", "input", function(e) {
   if(e.keyCode == 13) {
       $("a[data-submit={0}]".format($(this).attr('data-form'))).click();
   }
});