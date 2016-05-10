function Puzzle(cols, rows, images, tileHolder, original) {
    this.cols = cols;
    this.rows = rows;
    this.images = images;
    this.tileHolder = tileHolder;
    this.original = original;
    this.solved = false;
    this.solvedListeners = [];

    this.position = [cols - 1, rows - 1];
}

Puzzle.prototype.addSolvedListener = function (l) {
    this.solvedListeners.push(l);
};

Puzzle.prototype.checkSolved = function () {
    if (this.position[0] !== this.cols - 1 || this.position[1] !== this.rows - 1) {
        return;
    }
    for (var c = 0; c < this.cols; c += 1) {
        for (var r = 0; r < this.rows; r += 1) {
            if (!this.tile(c, r).has("img[data-col={0}][data-row={1}]".format(c, r)) && (c !== this.cols - 1 || this.rows !== -1)) {
                return;
            }
        }
    }

    this.solved = true;
    this.solvedListeners.forEach(function (l) {
        l();
    });
};

Puzzle.prototype.emptyTile = function () {
    return this.tile(this.position[0], this.position[1]);
};

Puzzle.prototype.integer_to_colrow = function (i) {
    return [i % this.cols, Math.floor(i / this.cols)]
};

Puzzle.prototype.onBoard = function (c, r) {
    c = parseInt(c);
    r = parseInt(r);
    return c >= 0 && r >= 0 && c < this.cols && r < this.rows;
};

Puzzle.prototype.piece = function (c, r) {
    c = parseInt(c);
    r = parseInt(r);
    return "{0}{1}_{2}.png".format(this.images, c, r);
};

Puzzle.prototype.shuffle = function () {

};

Puzzle.prototype.swap = function (cell) {
    var od = cell.html(), tC = parseInt(cell.attr('data-col')), tR = parseInt(cell.attr('data-row'));
    if (this.swappable(tC, tR)) {
        cell.html('');
        this.emptyTile().html(od);
        this.position = [tC, tR];
        this.checkSolved();
    }
};

Puzzle.prototype.swappable = function (c, r) {
    c = parseInt(c);
    r = parseInt(r);
    return this.onBoard(c, r) && (this.position[0] == c ? Math.abs(this.position[1] - r) == 1 : this.position[1] == r ? Math.abs(this.position[0] - c) == 1 : false);
};

Puzzle.prototype.tile = function (c, r) {
    c = parseInt(c);
    r = parseInt(r);
    return this.tileHolder.find("td[data-col={0}][data-row={1}]".format(c, r));
};