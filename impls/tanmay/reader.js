const { MalValue,
  MalList,
  MalSymbol,
  MalVector,
  MalNil,
  MalBoolean,
  MalString
} = require('./types.js');

class Reader {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  peek() {
    return this.tokens[this.position];
  }

  next() {
    const token = this.peek();
    this.position++;
    return token;
  }
}

const tokenize = str => {
  const re = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;

  return [...str.matchAll(re)].map(x => x[1]).slice(0, -1);
};

const read_seq = (reader, closingSympbol) => {
  reader.next();
  const ast = [];

  while (reader.peek() != closingSympbol) {
    if (reader.peek() === undefined) {
      throw 'unbalanced';
    }
    ast.push(read_from(reader));
  }

  reader.next()
  return ast;
};

const read_list = (reader) => {
  const ast = read_seq(reader, ')');
  return new MalList(ast);
};

const read_vector = (reader) => {
  const ast = read_seq(reader, ']');
  return new MalVector(ast);
};


const read_atom = (reader) => {
  const token = reader.next();

  if (token.match(/^-?[0-9]+$/)) {
    return new MalValue(parseInt(token));
  } else if (token === 'true') {
    return new MalBoolean(token);
  } else if (token === 'false') {
    return new MalBoolean(token);
  } else if (token === 'nil') {
    return new MalNil(token);
  }
  else if (token.match(/^".*"$/)) {
    return new MalString(token);
  }

  return new MalSymbol(token);
};

const read_from = reader => {
  const token = reader.peek();

  switch (token[0]) {
    case '(':
      return read_list(reader);
    case '[':
      return read_vector(reader);
    default:
      return read_atom(reader);
  }
};

const read_str = str => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  return read_from(reader);
};

module.exports = { read_str, Reader };