(function ($, w) {
    "use strict";

    var Puzzle = function (cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.position = [cols - 1, rows - 1];
    };

    Puzzle.prototype.swappable = function (c, r) {
        return this.position[0] == c ? Math.abs(this.position[1] - r) == 1 : this.position[1] == r ? Math.abs(this.position[0] - c) == 1 : false;
    };

    w.Puzzle = Puzzle;
})(window.jQuery, window);