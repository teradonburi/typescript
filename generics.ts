// すべての型に対応するためにはany型の引数を渡せばよいですが、型の情報が失われます。
function identity1(arg: any): any {
  return arg;
}
console.log(identity1("hello"));

// ジェネリックスを使うと型の情報は失われません。
// Tに型の情報が入り、コンパイル時に型は推論され決定されます。
function identity2<T>(arg: T): T {
  return arg;
}
console.log(identity2<string>("world")); // stringを明示的に指定して渡す
console.log(identity2(2)); // 暗黙の型推論に任せる（複雑な場合はコンパイラが型推論に失敗する場合があるのでその場合は明示的に指定する）

// 配列引数のジェネリックス
function loggingIdentity1<T>(arg: T[]): T[] {
  console.log(arg.length); // Array型なのでlengthを必ず持つことが保証されている
  return arg;
}
console.log(loggingIdentity1(["a", "b", "c"]));

// こう書いても同じです
// function loggingIdentity<T>(arg: Array<T>): Array<T> {
//   console.log(arg.length);  // Array型なのでlengthを必ず持つことが保証されている
//   return arg;
// }

// ジェネリックス型(Generics Type)

// ジェネリックス関数の型は、非ジェネリック関数の型とまったく同じです。
// 関数宣言と同様に、変数にジェネリックス関数の型パラメーターを指定します。
function identity3<T>(arg: T): T {
  return arg;
}

const myIdentity1: <T>(arg: T) => T = identity3;
console.log(myIdentity1("テスト1"));

// 型変数の数と型変数が揃っている限り、型のジェネリック型パラメーターに別の名前を使用することもできます。
const myIdentity2: <U>(arg: U) => U = identity3;
console.log(myIdentity2("テスト2"));

// ジェネリックス型をオブジェクトリテラル型の呼び出しシグネチャとして書くこともできます。
const myIdentity3: { <T>(arg: T): T } = identity3;
console.log(myIdentity3("テスト3"));

// ジェネリックスのinterface、オブジェクトリテラルをinterface内に記述する
interface GenericIdentityFn1 {
  <T>(arg: T): T;
}

const myIdentity4: GenericIdentityFn1 = identity3;
console.log(myIdentity4("テスト4"));

// 同様の例で、ジェネリックパラメーターをインターフェイス全体のパラメーターに移動することもできます。
// これによりインタフェース内の他のメンバが型パラメーターを参照することができるようになります。
interface GenericIdentityFn2<T> {
  (arg: T): T;
}
// 明示的に型を指定する必要あり
const myIdentity5: GenericIdentityFn2<string> = identity3;
console.log(myIdentity5("テスト5"));

// ジェネリックスクラス(Generic Classes)

// ジェネリッククラスは、ジェネリックインターフェイスに似ています。
// ジェネリッククラスには、クラス名の後に山括弧（<>）で囲まれたジェネリック型パラメーターリストがあります。
class GenericNumber<T> {
  private zeroValue: T;
  public add: (x: T, y: T) => T;
  public constructor(zeroValue: T, add: (x: T, y: T) => T) {
    this.zeroValue = zeroValue;
    this.add = add;
  }
}

// この例では数値用にジェネリックスクラスを生成していますが、文字列などの利用もできます
let myGenericNumber = new GenericNumber<number>(0, (x, y): number => x + y);
console.log(myGenericNumber);

// ジェネリッククラスは、静的側ではなくインスタンス側でのみジェネリックであるため、
// クラスを操作する場合、静的メンバはクラスの型パラメーターを使用できません。
// なお、ジェネリックインターフェイスとジェネリッククラスは名前空間を作成することはできません。
// また、ジェネリックスの列挙型は存在しません。

// ジェネリックスの制約(Generic Constraints)
// ジェネリックス型にそのメンバを持つ保証がない場合はコンパイルエラーとなります。

// function loggingIdentity2<T>(arg: T): T {
//   console.log(arg.length); // T型がlengthを持つ保証がないのでエラーになる
//   return arg;
// }

// そこでlengthを持つという制約を記述するインターフェースを作成します。
// ここでは、単一の.lengthプロパティを持つインターフェイスを作成し、
// このインターフェイスとextendsキーワードを使用して制約を示します。

interface Lengthwise {
  length: number;
}

function loggingIdentity3<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Lengthwiseにはlengthを持つことが保証されているのでエラーにならない
  return arg;
}
// console.log(loggingIdentity2(3)); // エラー: lengthが存在していない
loggingIdentity3({ length: 10, value: 3 }); // OK: lengthが存在している

// ジェネリック制約での型パラメーターの使用(Using Type Parameters in Generic Constraints)

// 別の型パラメーターによって制約される型パラメーターを宣言できます。
// たとえば、ここでは、キー名が指定されたオブジェクトからプロパティを取得します。
// objに存在しないプロパティを誤って取得しないように、2つの型の間に制約を設定します。
function getProperty<T, K extends keyof T>(obj: T, key: K): T[keyof T] {
  return obj[key];
}

let y = { a: 1, b: 2, c: 3, d: 4 };

console.log(getProperty(y, "a")); // OK
// console.log(getProperty(y, "m")); // エラー: mは 'a' | 'b' | 'c' | 'd'に割り当てられていません

// ジェネリックスのクラス型での利用(Using Class Types in Generics)
// ジェネリックを使用してTypeScriptでファクトリークラスを作成する場合、
// コンストラクター関数でクラス型を参照する必要があります。
class Test {
  public constructor() {
    console.log("hello");
  }
}
// クラス型を引数に渡す
function createClassInstance<T>(c: { new (): T }): T {
  return new c(); // インスタンス生成
}
// こちらでも同じ
// function create<T>(c: new () => T ): T {
//   return new c(); // インスタンス生成
// }
console.log(createClassInstance(Test));

// より高度な例では、prototypeプロパティを使用して、
// コンストラクター関数とクラス型のインスタンス側との関係を推測および制約します。
class BeeKeeper {
  public hasMask: boolean = false;
}

class ZooKeeper {
  public nametag: string = "";
}

class PlantKeeper {
  public nametag: string = "";
}

class Anim {
  public numLegs: number = 0;
}

class Bee extends Anim {
  public keeper: BeeKeeper = new BeeKeeper();
}

class Lion extends Anim {
  public keeper: ZooKeeper = new ZooKeeper();
}

class Plant {
  public keeper: PlantKeeper = new PlantKeeper();
}

// Anim型を継承したクラスのインスタンスを返す関数
function createInstance<A extends Anim>(c: new () => A): A {
  return new c();
}

createInstance(Lion).keeper.nametag; // OK
createInstance(Bee).keeper.hasMask; // OK
// createInstance(Bee).keeper.nametag; // エラー：nametagはBeeに存在しない
// createInstance(Plant).keeper.nametag; // エラー：PlantはAnimの子クラスでない
