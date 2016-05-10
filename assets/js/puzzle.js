function Puzzle(cols, rows, images, tileHolder) {
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

Puzzle.prototype.onBoard = function (c, r) {
    c = parseInt(c);
    r = parseInt(r);
    console.log(c);
    console.log(c < this.cols);
    return c >= 0 && r >= 0 && c < this.cols && r < this.rows;
};

Puzzle.prototype.piece = function (c, r) {
    c = parseInt(c);
    r = parseInt(r);
    return "{0}{1}_{2}.png".format(this.images, c, r);
};

Puzzle.prototype.setOriginal = function (loc) {
    this.original = loc;
};

Puzzle.prototype.shuffle = function () {

};

Puzzle.prototype.swap = function (cell) {
    var od = cell.html(), tC = parseInt(cell.attr('data-col')), tR = parseInt(cell.attr('data-row'));
    cell.html('');
    this.emptyTile().html(od);
    console.log("old");
    console.log(this.position);
    this.position = [tC, tR];
    console.log("new");
    console.log(this.position);
};

Puzzle.prototype.swappable = function (c, r) {
    c = parseInt(c);
    r = parseInt(r);
    return this.onBoard(c, r) && this.position[0] == c ? Math.abs(this.position[1] - r) == 1 : this.position[1] == r ? Math.abs(this.position[0] - c) == 1 : false;
};

Puzzle.prototype.tile = function (c, r) {
    c = parseInt(c);
    r = parseInt(r);
    return this.tileHolder.find("td[data-col={0}][data-row={1}]".format(c, r));
};