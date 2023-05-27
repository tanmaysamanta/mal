const { MalValue } = require('./types');

const pr_str = (malValue) => {
  if (malValue instanceof MalValue) {
    return malValue.pr_str();
  }
};

module.exports = { pr_str };