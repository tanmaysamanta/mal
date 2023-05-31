const readline = require('readline');

const { read_str } = require('./reader.js')
const { pr_str } = require('./printer.js');
const { MalSymbol, MalList, MalValue, MalNil, MalBoolean } = require('./types.js');
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

const isTrue = (value) => {
  return !(value == null || value == false || value == 'false');
};

const EVAL = (ast, env) => {
  if (!(ast instanceof MalList)) {
    return eval_ast(ast, env);
  }
  if (ast.isEmpty()) return ast;

  switch (ast.value[0].value) {
    case 'def!':
      env.set(ast.value[1], EVAL(ast.value[2], env));
      return env.get(ast.value[1]);

    case "let*":
      const new_env = new Env(env);
      const bindings = ast.value[1].value;

      for (let index = 0; index < bindings.length; index += 2) {
        new_env.set(bindings[index], EVAL(bindings[index + 1], new_env));
      }
      const expected_value = EVAL(ast.value[2], new_env);

      if (expected_value) {
        return expected_value;
      }
      return new MalNil();

    case "do":
      const [, ...list] = ast.value;
      const evaluate_ast = eval_ast(new MalList(list), env);

      const evaluate_value = evaluate_ast.value;

      return evaluate_value[evaluate_value.length - 1];

    case "if":
      const [, predicate, ifExp, elseExp] = ast.value;
      const result = isTrue(EVAL(predicate, env).value);

      console.log(EVAL(predicate, env));

      console.log(result);

      if (result) {
        return EVAL(ifExp, env);
      } else if (elseExp) {
        return EVAL(elseExp, env);
      } else {
        return new MalNil()
      }
    case "fn*":
      const [, args, binds] = ast.value;


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
env.set(new MalSymbol('prn'), () => console.log('Hello'));
env.set(new MalSymbol('='), (...args) => args.reduce((a, b) => new MalBoolean(a.isEqual(b))))

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