const a: number = 3;
const b: string = "aaaaa";

// Objectの型定義にはinterfaceを使う 
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
