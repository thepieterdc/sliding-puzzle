function Puzzle(cols, rows, images) {
    var pieceRow;

    this.cols = cols;
    this.rows = rows;
    this.images = images;
    this.position = [cols - 1, rows - 1];
    this.pieces = [];
    for (var c = 0; c < cols; c += 1) {
        pieceRow = [];
        for (var r = 0; r < rows; r += 1) {
            pieceRow.push(c * this.cols + r);
        }
        this.pieces.push(pieceRow);
    }
}

Puzzle.prototype.integer_to_colrow = function(i) {
    return [i % this.cols, Math.floor(i/this.cols)]
};

Puzzle.prototype.piece = function (c, r) {
    return "{0}{1}_{2}.png".format(this.images, c, r);
};

Puzzle.prototype.setOriginal = function (loc) {
    this.original = loc;
};

Puzzle.prototype.shuffle = function () {

};

Puzzle.prototype.swappable = function (c, r) {
    return this.position[0] == c ? Math.abs(this.position[1] - r) == 1 : this.position[1] == r ? Math.abs(this.position[0] - c) == 1 : false;
};