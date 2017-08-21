const player = require('player')

player.prototype.prev = function () {
    let currentId = this.playing._id;
    if (currentId === 0) {
        currentId = this._list.length;
    }
    this.stop();
    this.play(currentId - 1);
}

function splitName(str) {
    return str.split('/').pop()
}

module.exports = exports = player;
exports.default = player