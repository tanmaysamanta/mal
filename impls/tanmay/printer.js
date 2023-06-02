const { MalValue, MalString, MalNil } = require('./types');

const pr_str = (malValue, print_readably = false) => {

  if (print_readably) {
    return malValue.pr_str();
  }

  if (malValue instanceof MalValue) {
    return malValue.pr_str();
  }

  return malValue.toString();
};

module.exports = { pr_str };