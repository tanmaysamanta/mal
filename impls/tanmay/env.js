const { MalValue } = require('./types');

class Env {
  #outer
  #data
  constructor(outer, binds, exprs) {
    this.#outer = outer;
    this.#data = {};
    this.#setBinds(binds, exprs);
  }

  #setBinds(binds, exprs) {
    if (binds) {
      for (let i = 0; i < binds.length; i++) {
        const bind = binds[i].value;
        if (exprs[i]) {
          this.#data[bind] = new MalValue(exprs[i].value);
        } else {
          throw `${bind} is not defined`;
        }
      }
    }
  }

  set(symbol, malValue) {
    this.#data[symbol.value] = malValue;
  }

  find(symbol) {
    if (this.#data[symbol.value]) {
      return this;
    }
    if (this.#outer) {
      return this.#outer.find(symbol);
    }
  }

  get(symbol) {
    const env = this.find(symbol);
    if (!env) throw `${symbol.value} not found`
    return env.#data[symbol.value];
  }
}

module.exports = { Env };