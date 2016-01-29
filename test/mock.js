function Mock() {
  this.added = [];
  this.methods = {};
}

Mock.prototype.add = function add(options) {
  this.added.push(options);
};

module.exports = Mock;
