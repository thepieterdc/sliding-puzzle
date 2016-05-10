function Puzzle(cols, rows, images, tileHolder) {
    var pieceRow;

    this.cols = cols;
    this.rows = rows;
    this.images = images;
    this.tileHolder = tileHolder;
    this.position = [cols - 1, rows - 1];
}

Puzzle.prototype.emptyTile = function () {
    return this.tile(this.position[0], this.position[1]);
};

Puzzle.prototype.integer_to_colrow = function (i) {
    return [i % this.cols, Math.floor(i / this.cols)]
};

Puzzle.prototype.piece = function (c, r) {
    return "{0}{1}_{2}.png".format(this.images, c, r);
};

Puzzle.prototype.setOriginal = function (loc) {
    this.original = loc;
};

Puzzle.prototype.shuffle = function () {

};

Puzzle.prototype.swap = function (cell) {
    var od = cell.html(), tC = cell.attr('data-col'), tR = cell.attr('data-row');
    cell.html('');
    this.emptyTile().html(od);
    this.position = [tC, tR];
};

Puzzle.prototype.swappable = function (c, r) {
    return c >= 0 && c < this.cols && r >= 0 && r < this.rows && this.position[0] == c ? Math.abs(this.position[1] - r) == 1 : this.position[1] == r ? Math.abs(this.position[0] - c) == 1 : false;
};

Puzzle.prototype.tile = function (c, r) {
    return this.tileHolder.find("td[data-col={0}][data-row={1}]".format(c, r));
};