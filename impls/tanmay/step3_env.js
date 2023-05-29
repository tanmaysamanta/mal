const readline = require('readline');

const { read_str } = require('./reader.js')
const { pr_str } = require('./printer.js');
const { MalSymbol, MalList, MalValue } = require('./types.js');
const { Env } = require('./env.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env.get(ast);
  }

  if (ast instanceof MalList) {
    const newAst = ast.value.map(x => EVAL(x, env));
    return new MalList(newAst);
  }

  return ast;
};

const READ = str => read_str(str);

const EVAL = (ast, env) => {
  if (!(ast instanceof MalList)) {
    return eval_ast(ast, env);
  }
  if (ast.isEmpty()) return ast;

  switch (ast.value[0].value) {
    case 'def!':
      env.set(ast.value[1], EVAL(ast.value[2], env));
      return env.get(ast.value[1]);
  }

  const [fn, ...args] = eval_ast(ast, env).value;

  return fn.apply(null, args);
};

const PRINT = malValue => pr_str(malValue);

const env = new Env();
env.set(new MalSymbol('+'), (...args) => args.reduce((a, b) => new MalValue(a.add(b))));
env.set(new MalSymbol('-'), (...args) => args.reduce((a, b) => new MalValue(a.sub(b))));
env.set(new MalSymbol('*'), (...args) => args.reduce((a, b) => new MalValue(a.mul(b))));
env.set(new MalSymbol('/'), (...args) => args.reduce((a, b) => new MalValue(a.div(b))));

const rep = arg => PRINT(EVAL(READ(arg), env))


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