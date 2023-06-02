const { deepEqual } = require('./utils.js');
class MalValue {
  constructor(value) {
    this.value = value;
  }

  add(otherMalValue) {
    return this.value + otherMalValue.value;
  }

  sub(otherMalValue) {
    return this.value - otherMalValue.value;
  }

  mul(otherMalValue) {
    return this.value * otherMalValue.value;
  }

  div(otherMalValue) {
    return Math.floor(this.value / otherMalValue.value);
  }

  isEqual(otherMalValue) {
    return deepEqual(this.value, otherMalValue.value);
  }

  isLessThan(otherMalValue) {
    return this.value < otherMalValue.value;
  }

  isGreaterThan(otherMalValue) {
    return this.value > otherMalValue.value;
  }

  isLessEqual(otherMalValue) {
    return this.value <= otherMalValue.value;
  }

  isGreaterEqual(otherMalValue) {
    return this.value >= otherMalValue.value;
  }

  pr_str() {
    return this.value.toString();
  }

}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalList extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return '(' + this.value.map(x => x.pr_str()).join(' ') + ')';
  }

  isEmpty() {
    return this.value.length === 0;
  }
}

class MalVector extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return '[' + this.value.map(x => x.pr_str()).join(' ') + ']';
  }
}

class MalString extends MalValue {
  constructor(str) {
    super(str);
  }

  pr_str() {
    return this.value;
  }
}
class MalNil extends MalValue {
  constructor() {
    super(null);
  }

  pr_str() {
    return 'nil';
  }
}

class MalBoolean extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return this.value.toString();
  }
}

module.exports = {
  MalSymbol,
  MalValue,
  MalList,
  MalVector,
  MalNil,
  MalBoolean,
  MalString
};