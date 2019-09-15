// TypeScriptには、一般的な型変換を容易にするいくつかのユーティリティタイプが用意されています。
// これらのユーティリティはグローバルに利用可能です。
// 参考：https://log.pocka.io/posts/typescript-builtin-type-functions/

// Partial<T>
// Tのすべてのプロパティがオプショナルに設定された型を構築します。
// このユーティリティは、指定されたタイプのすべてのサブセットを表すタイプを返します。
// つまり、型Tのすべてのプロパティを省略可能( | undefined)にした新しい型を返すMapped Typeです。
interface Todo1 {
  title: string;
  description: string;
}

// Partial<Todo1>はこれと同じ
// interface Todo1 {
//   title?: string;
//   description?: string;
// }

// Partial<Todo>で部分的に更新して値を返す
function updateTodo(todo: Todo1, fieldsToUpdate: Partial<Todo1>): Todo1 {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter"
};

const todo2 = updateTodo(todo1, {
  description: "throw out trash"
});
console.log(todo2);

// Readonly<T>
// Tのすべてのプロパティが読み取り専用に設定された型を構築します。
// つまり、構築された型のプロパティは再割り当てできません。

interface Todo2 {
  title: string;
}

// Readonly<Todo2>はこれと同じ
// interface Todo2 {
//   readonly title: string;
// }

const todo3: Readonly<Todo2> = {
  title: "Delete inactive users"
};

// todo3.title = "Hello"; // エラー：titleはreadonly
console.log(todo3);

// このユーティリティは、実行時に失敗する割り当て式を表すのに役立ちます
// （つまり、Object.freezeされたプロパティを再割り当てしようとする場合）。
declare function freeze<T>(obj: T): Readonly<T>;

// Record<K,T>
// 型TのプロパティKのセットを持つ型を構築します。
// このユーティリティは、型のプロパティを別の型にマップするために使用できます。

// マッピングする値のinterface
interface PageInfo {
  title: string;
}

// マップ対象のキー
type Page = "home" | "about" | "contact";

const rec: Record<Page, PageInfo> = {
  about: { title: "about" },
  contact: { title: "contact" },
  home: { title: "home" }
  // hoge: {title: 'hoge'} // Pageにhogeは定義されていないのでマップできない
};
console.log(rec);

// Pick<T,K>
// TからプロパティKのセットを選択して、型を構築します。
interface Todo3 {
  title: string;
  description: string;
  completed: boolean;
}

// Pick<Todo3, "title" | "completed">はこれと同じ
// interface Todo3 {
//   title: string;
//   completed: boolean;
// }

const todo4: Pick<Todo3, "title" | "completed"> = {
  title: "Clean room",
  completed: false
};
console.log(todo4);

// Omit<T,K>
// Tからすべてのプロパティを選択してKを削除することにより、型を構築します。
interface Todo4 {
  title: string;
  description: string;
  completed: boolean;
}

// Omit<Todo4, "description">はこれと同じ
// interface Todo4 {
//   title: string;
//   completed: boolean;
// }

const todo5: Omit<Todo4, "description"> = {
  title: "Clean room",
  completed: false
};
console.log(todo5);

// Exclude<T,U>
// TからUに割り当て可能なすべてのプロパティを除外することにより、型を構築します。
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type T2 = Exclude<string | number | (() => void), Function>; // string | number

// const alpha1: T0 = "a"; // エラー："a"は除外済み
const alpha2: T0 = "c";
console.log(alpha2);
// const beta1: T2 = (): void => {}; // エラー：() => voidは除外済み
const beta2: T2 = 0;
console.log(beta2);

// Extract<T,U>
// TからUに割り当て可能なすべてのプロパティを抽出することにより、型を構築します。
type T3 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
type T4 = Extract<string | number | (() => void), Function>; // () => void

const gumma1: T3 = "a";
// const gumma2: T3 = "f"; // エラー："f"は"a" | "b" | "c"に含まれていない
console.log(gumma1);

// NonNullable<T>
// Tからnullおよびundefinedを除外して、型を構築します。
type T5 = NonNullable<string | number | undefined>; // string | number
type T6 = NonNullable<string[] | null | undefined>; // string[]
// let theta1: T6 = null; // エラー：null指定できない
let theta2: T6 = ["x", "y"];
console.log(theta2);

// ReturnType<T>
// 関数Tの戻り値の型で構成される型を構築します。
function f1(): { a: number; b: string } {
  return { a: 1, b: "hello" };
}

type T7 = ReturnType<() => string>; // string
type T8 = ReturnType<(s: string) => void>; // void
type T9 = ReturnType<<T>() => T>; // {}
type T10 = ReturnType<<T extends U, U extends number[]>() => T>; // number[]
type T11 = ReturnType<typeof f1>; // { a: number, b: string }
type T12 = ReturnType<any>; // any
type T13 = ReturnType<never>; // any
// type T14 = ReturnType<string>; // エラー
// type T15 = ReturnType<Function>; // エラー

const func1: T11 = f1();
console.log(func1);

// InstanceType<T>
// コンストラクター関数型Tのインスタンス型で構成される型を構築します。
class C {
  public x: number = 0;
  public y: number = 0;
}

type T16 = InstanceType<typeof C>; // C
type T17 = InstanceType<any>; // any
type T18 = InstanceType<never>; // any
// type T19 = InstanceType<string>; // エラー
// type T20 = InstanceType<Function>; // エラー
const cla: T16 = new C();
console.log(cla);

// Required<T>
// requiredに設定されたTのすべてのプロパティで構成される型を構築します。
interface Props {
  a?: number;
  b?: string;
}

// Required<Props>はこれと同じ
// interface Props {
//   a: number;
//   b: string;
// }

const obj1: Required<Props> = { a: 5, b: "ok" }; // OK
// const obj2: Required<Props> = { a: 5 }; // エラー: 'b'も必須パラメータ
console.log(obj1);

// ThisType<T>
// thisの型をTとすることができる特殊な型です。
// このユーティリティを使用するには、-noImplicitThisフラグを有効にする必要があることに注意してください。

// 次の例では、makeObjectへの引数のメソッドオブジェクトには、ThisType <D＆M>を含む型があります。
// したがって、methodsオブジェクト内のメソッドのthisの型は{x：number、y：number}＆{moveBy（dx：number、dy：number）：number}です
// メソッドプロパティの型が同時に推論ターゲットであり、メソッドのthisの型を決定するものであることに注意してください。

interface ObjectDescriptor<D, M> {
  data: D;
  methods: M & ThisType<D & M>; // methodの「this」の型はD＆M
}

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: D = desc.data;
  let methods: M = desc.methods;
  const ret: D & M = { ...data, ...methods };
  return ret;
}

const obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number): void {
      this.x += dx; // 強い型付されたthis
      this.y += dy; // 強い型付されたthis
      // this.z = 10; // noImplicitThisを有効にしている場合はエラー：プロパティ 'z' は型 '{ x: number; y: number; } & { moveBy(dx: number, dy: number): void; }' に存在しません。
    }
  }
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
console.log(obj);

// Parameters<T>
// 関数型Tの引数の型をタプルとして抽出します。
function foo1(arg1: string, arg2: number): void {}
function bar1(): void {}

type Foo1 = Parameters<typeof foo1>; // [string, number]
type Bar1 = Parameters<typeof bar1>; // []
const paramsFoo: Foo1 = ["arg1", 100];
// const paramsNotFoo: Foo = ["arg1", 100, true]; // エラー：型が一致しない
console.log(paramsFoo);

// ConstructorParameters<T>
// 型Tのコンストラクタの引数の型をタプルとして抽出します。
// Parametersのコンストラクタ版です。
class Foo2 {
  public constructor(arg1: string, arg2?: boolean) {}
}

type Bar2 = ConstructorParameters<typeof Foo2>; // [string, boolean] | [string]
const constructorParams: Bar2 = ["abc", true];
console.log(constructorParams);
