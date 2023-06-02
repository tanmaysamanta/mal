const isArray = Array.isArray;

const deepEqual = function (list1, list2) {
  if (list1 === list2) {
    return true;
  }

  const areArrays = isArray(list1) && isArray(list2);
  if (!areArrays) {
    return false;
  }

  if (list1.length !== list2.length) {
    return false;
  }

  for (let index = 0; index < list1.length; index++) {
    if (!deepEqual(list1[index].value, list2[index].value)) {
      return false;
    }
  }
  return true;
};

module.exports = { deepEqual }