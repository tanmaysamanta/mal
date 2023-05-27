const readline = require('readline');

const { read_str } = require('./reader.js')
const { pr_str } = require('./printer.js')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const READ = str => read_str(str);

const EVAL = ast => ast;

const PRINT = malValue => pr_str(malValue);

const rep = arg => PRINT(EVAL(READ(arg)))


const repl = () =>
  rl.question('user> ', line => {
    try {
      console.log(rep(line));
    } catch (error) {
      console.log(error)
    }
    repl();
  });

repl();