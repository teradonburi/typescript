// typescript文法参考
// https://qiita.com/uhyo/items/e2fdef2d3236b9bfe74a
// tsconfig設定参考
// https://qiita.com/alfas/items/539ade65926deb530e0e
// VSCodeでESLint+@typescript-eslint+Prettierを導入する
// https://qiita.com/madono/items/a134e904e891c5cb1d20

const a: number = 3;
const b: string = "aaaaa";

interface MyObj {
  foo: string;
  bar: number;
}

const obj: MyObj = {
  foo: "foo",
  bar: 3
};

console.log(a);
console.log(b);
console.log(obj);

const foo: number[] = [0, 1, 2, 3];
foo.push(4);

console.log(foo);

function func(arg: string): number {
  return Number(arg);
}

const f: (foo: string) => number = func;

console.log(f("1"));
