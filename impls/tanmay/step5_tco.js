const readline = require('readline');

const { read_str } = require('./reader.js')
const { pr_str } = require('./printer.js');
const { MalSymbol, MalList, MalValue, MalNil, MalBoolean, MalVector, MalFunction } = require('./types.js');
const { Env } = require('./env.js');
const { count, prn } = require('./core.js');

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

  if (ast instanceof MalVector) {
    const newAst = ast.value.map(x => EVAL(x, env));
    return new MalVector(newAst);
  }

  return ast;
};

const READ = str => read_str(str);

const isTrue = (value) => {
  if (value instanceof MalList) {
    console.log("is list");
    return true;
  }
  return !(value === null || value == false || value === 'false');
};

const handleLet = (ast, env) => {
  const new_env = new Env(env);
  const bindings = ast.value[1].value;

  for (let index = 0; index < bindings.length; index += 2) {
    new_env.set(bindings[index], EVAL(bindings[index + 1], new_env));
  }

  return [ast.value[2], new_env];
};

const handleDo = (ast, env) => {
  const [, ...list] = ast.value;
  const evaluate_ast = eval_ast(new MalList(list.slice(0, -1)), env);

  return list[list.length - 1];
};

const handleIf = (ast, env) => {
  const [, predicate, ifExp, elseExp] = ast.value;

  const result = EVAL(predicate, env).value === 0 ? true : isTrue(EVAL(predicate, env).value);

  if (result) {
    return ifExp;
  } else if (elseExp) {
    return elseExp;
  } else {
    return new MalNil()
  }
};

const handleFn = (ast, env) => {
  const [, binds, ...fnBody] = ast.value;
  const form = new MalList([new MalSymbol('do'), ...fnBody]);
  return new MalFunction(form, binds, env);
};

const handleDef = (ast, env) => {
  env.set(ast.value[1], EVAL(ast.value[2], env));
  return env.get(ast.value[1]);
};

const EVAL = (ast, env) => {
  while (true) {
    if (!(ast instanceof MalList)) {
      return eval_ast(ast, env);
    }
    if (ast.isEmpty()) return ast;

    switch (ast.value[0].value) {
      case 'def!':
        return handleDef(ast, env);
      case "let*":
        [ast, env] = handleLet(ast, env);
        break;
      case "do":
        ast = handleDo(ast, env);
        break;
      case "if":
        ast = handleIf(ast, env);
        break;
      case "fn*":
        ast = handleFn(ast, env);
        break;
      default:
        const [fn, ...args] = eval_ast(ast, env).value;
        if (fn instanceof MalFunction) {
          ast = fn.value;
          binds = fn.binds;
          new_env = fn.env;
          env = new Env(new_env, binds.value, args);
        } else {
          return fn.apply(null, args);
        }
    }
  }
};

const PRINT = malValue => pr_str(malValue);

const env = new Env();

env.set(new MalSymbol('+'), (...args) => args.reduce((a, b) => new MalValue(a.add(b))));
env.set(new MalSymbol('-'), (...args) => args.reduce((a, b) => new MalValue(a.sub(b))));
env.set(new MalSymbol('*'), (...args) => args.reduce((a, b) => new MalValue(a.mul(b))));
env.set(new MalSymbol('/'), (...args) => args.reduce((a, b) => new MalValue(a.div(b))));
env.set(new MalSymbol('prn'), (...args) => prn(args));

env.set(new MalSymbol('='), (...args) => args.reduce((a, b) => new MalBoolean(a.isEqual(b))));
env.set(new MalSymbol('<='), (...args) => args.reduce((a, b) => new MalBoolean(a.isLessEqual(b))));
env.set(new MalSymbol('>='), (...args) => args.reduce((a, b) => new MalBoolean(a.isGreaterEqual(b))));
env.set(new MalSymbol('<'), (...args) => args.reduce((a, b) => new MalBoolean(a.isLessThan(b))));
env.set(new MalSymbol('>'), (...args) => args.reduce((a, b) => new MalBoolean(a.isGreaterThan(b))));

env.set(new MalSymbol('list'), (...args) => new MalList(args));
env.set(new MalSymbol('list?'), (...args) => ((args[0]) instanceof MalList));
env.set(new MalSymbol('count'), (...args) => count(args[0]));
env.set(new MalSymbol('empty?'), (...args) => args[0].value.length === 0);
env.set(new MalSymbol('not'), (...args) => isTrue(args[0].value) || args[0].value === 0 ? false : true);

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