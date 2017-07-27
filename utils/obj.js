// ({a:{b:{c:1}}}, 'a.b.c') => 1
const get = (obj, path) => {
  if (!obj) return;
  if (!path) return obj;
  return path.split('.').reduce((memo, next) => {
    return memo[next];
  }, obj);
}

//(1, 'a.b.c') => {a:{b:{c:1}}}
const set = (value, path) => {
  if (!path) return value;
  return path.split('.').reverse().reduce((memo, next) => {
    return { [next]: memo }
  }, value);
}

export {
  get,
  set,
};
