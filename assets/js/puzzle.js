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
        return false;
    }
    for (var c = 0; c < this.cols; c += 1) {
        for (var r = 0; r < this.rows; r += 1) {
            if (this.tile(c, r).has("img[data-col={0}][data-row={1}]".format(c, r)).size() == 0 && (c !== this.cols - 1 || r !== this.rows - 1)) {
                return false;
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
    var cR = 0, rR = 0, tile;
    for (var i = 0; i < this.rows * this.cols * 101; i += 1) {
        cR = Math.random();
        rR = Math.random();
        tile = this.tile(parseInt(this.position[0]) + Math.sign(cR > 0.5 ? Math.pow(-1, Math.round(cR * 2)) : 0), parseInt(this.position[1]) + Math.sign(rR > 0.5 ? Math.pow(-1, Math.round(rR * 2)) : 0));
        if (typeof tile !== "undefined") {
            this.swap(tile, true);
        }
    }
};

Puzzle.prototype.swap = function (cell, init) {
    var od = typeof cell !== "undefined" ? cell.html() : undefined;
    var tC = typeof cell !== "undefined" ? parseInt(cell.attr('data-col')) : -1;
    var tR = typeof cell !== "undefined" ? parseInt(cell.attr('data-row')) : -1;
    init = (typeof init !== "undefined" || init) && init;
    if (!this.solved) {
        if (this.swappable(tC, tR)) {
            cell.html('');
            this.emptyTile().html(od);
            this.position = [tC, tR];
            if (!init) {
                this.checkSolved();
            }
        }
    }
};

Puzzle.prototype.swappable = function (c, r) {
    c = parseInt(c);
    r = parseInt(r);
    return this.onBoard(c, r) && (this.position[0] == c ? Math.abs(this.position[1] - r) == 1 : this.position[1] == r ? Math.abs(this.position[0] - c) == 1 : false);
};

Puzzle.prototype.tile = function (c, r) {
    var tile = this.tileHolder.find("td[data-col={0}][data-row={1}]".format(parseInt(c), parseInt(r)));
    return tile.length !== 0 ? tile : undefined;
};