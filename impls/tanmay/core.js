const { MalValue, MalNil } = require('./types.js');

const count = (arg) => {
  if (arg instanceof MalNil) {
    return new MalValue(0);
  }
  return new MalValue(arg.value.length);
};

const prn = (args) => {
  console.log(args.map((arg) => arg.pr_str()).join(' '));
  return new MalNil();
}

module.exports = { count, prn };