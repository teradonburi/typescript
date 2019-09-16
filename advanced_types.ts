// 交差型(Intersection Types)
// 交差型は、複数の型を1つに結合します。
// これにより、既存の型を追加して、必要なすべての機能を備えた単一の型を取得できます。
// たとえば、Personal＆LoggableはPersonalおよびLoggableのすべてのパラメータを持ちます
// mixinや、従来のオブジェクト指向型に適合しない他の概念に使用される交差型が主に表示されます。
// （JavaScriptにはこれらの多くがあります！）mixinの作成方法を示す簡単な例を次に示します。

interface Personal {
  name: string;
}

interface Loggable {
  log(data: string): void;
}

// 交差型はPersonal & Loggable両方のパラメータを持つ
const jim: Personal & Loggable = {
  name: "jim",
  log: (data: string): void => {
    console.log(`I'am ${data}`);
  }
};
jim.log(jim.name);

// 共有体型(Union Types)
// 共有体型は交差型と密接に関連していますが、使用方法は大きく異なります。
// 共有体型は、いくつかの型のいずれかになりうる値を|を使用して各型を分離して記述します。

function padLeft(value: string, padding: string | number): string | number {
  // typeofで元の型をチェックする(typeof型ガード)
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}

console.log(padLeft("Hello world", 1)); // OK
// console.log(padLeft("Hello world", true)); // エラー：paddingがstring, number以外はコンパイルエラー

// 共有体型を持つ値がある場合、共有体内のすべての型に共通するメンバーにのみアクセスできます。
// 値のタイプがA | Bの場合、AとBの両方が持っているメンバーがいることだけを保証しています。

interface Bird {
  fly: number;
  layEggs: string;
}

interface Fish {
  swim: number;
  layEggs: string;
}

function getSmallPet(): Fish | Bird {
  return { fly: 10, swim: 10, layEggs: "abc" };
}

let pet = getSmallPet();
console.log(pet.layEggs); // OK
// console.log(pet.swim); // エラー：共通メンバーでない

// 型ガードと区別型(Type Guards and Differentiating Types)
// Fish型かBird型か2つの可能な値を区別するJavaScriptの一般的なイディオムは、メンバーの存在を確認することです。
// 前述したように、共有体型のすべての構成型に含まれていることが保証されているメンバーにのみアクセスできます

// これらの各プロパティアクセスはエラーを引き起こします
// if (pet.swim) {
//   console.log(pet.swim);
// } else if (pet.fly) {
//   console.log(pet.fly);
// }

// 同じコードを機能させるには、型アサーションを使用する必要があります。
if ((pet as Fish).swim) {
  console.log((pet as Fish).swim);
} else if ((pet as Bird).fly) {
  console.log((pet as Bird).fly);
}

// ユーザー定義の型ガード（User-Defined Type Guards）
// TypeScriptには型ガードと呼ばれるものがあります。
// 型ガードは、あるスコープ内のタイプを保証するランタイムチェックを実行する式です。

// 型述語(is)の使用
// 型ガードを定義するには、戻り値の型が型述語である関数を定義するだけです。
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

// isFishが呼び出されると、TypeScriptは元の型に互換性がある場合、その変数をその特定の型に絞り込みます。
// そのため、if文の中のpetは型アサーションする必要がなくなります（else文の方も型が特定されます）
if (isFish(pet)) {
  console.log(pet.swim);
} else {
  console.log(pet.fly);
}

// in演算子を使用する
// in演算子は、型の絞り込み式として機能するようになりました。
// nが文字列リテラルまたは文字列リテラル型で、xがユニオン型であるx式のnの場合、
//「true」ブランチは、オプションまたは必須のプロパティnを持つ型に絞り込まれます
// 「false」ブランチは、オプションのプロパティnまたは欠落しているプロパティnを持つタイプに絞り込まれます。

function move(pet: Fish | Bird): number {
  // Fish or Birdのswimプロパティを持っている場合=Fish型の場合
  if ("swim" in pet) {
    return pet.swim; // Fish
  }
  return pet.fly; // Bird
}
console.log(move(pet));

// typeof型ガード
// typeof演算子で型の特定をします。

// function padLeft(value: string, padding: string | number): string | number {
//   // typeofで元の型をチェックする(typeof型ガード)
//   if (typeof padding === "number") {
//     return Array(padding + 1).join(" ") + value;
//   }
//   if (typeof padding === "string") {
//     return padding + value;
//   }
//   throw new Error(`Expected string or number, got '${padding}'.`);
// }

// instanceof型ガード
// classの型の特定をするためにはinstanceof演算子を使用します。
interface Padder {
  getPaddingString(): string;
}

class SpaceRepeatingPadder implements Padder {
  private numSpaces: number;
  public constructor(numSpaces: number) {
    this.numSpaces = numSpaces;
  }
  public getPaddingString(): string {
    return Array(this.numSpaces + 1).join(" ");
  }
}

class StringPadder implements Padder {
  private value: string;
  public constructor(value: string) {
    this.value = value;
  }
  public getPaddingString(): string {
    return this.value;
  }
}

function getRandomPadder(): SpaceRepeatingPadder | StringPadder {
  return Math.random() < 0.5
    ? new SpaceRepeatingPadder(4)
    : new StringPadder("  ");
}

let padder: Padder = getRandomPadder();
if (padder instanceof SpaceRepeatingPadder) {
  console.log("SpaceRepeatingPadder" + padder.getPaddingString() + "."); // SpaceRepeatingPadder型に特定されている
}
if (padder instanceof StringPadder) {
  console.log("StringPadder" + padder.getPaddingString() + "."); // StringPadder型に特定されている
}

// 型ガードと型アサーション(Type guards and type assertions)
// null許容型は共用体で実装されるため、型ガードを使用してnullを取り除く必要があります。
// 幸いなことに、これはJavaScriptで記述するコードと同じです。

function f3(sn: string | null): string {
  if (sn == null) {
    return "default";
  } else {
    return sn;
  }
}
console.log(f3(null));

// ここでは、nullの除去は非常に明白ですが、|| 演算子も使用できます。
function f4(sn: string | null): string {
  return sn || "default";
}
console.log(f4(null));

// コンパイラーがnullまたはundefinedを除去できない場合、型演算子を使用してそれらを手動で削除できます。
// function broken(name: string | null): string {
//   function postfix(epithet: string) {
//     return name.charAt(0) + ".  the " + epithet; // エラー：'name'がnullの可能性があります
//   }
//   name = name || "Bob";
//   return postfix("great");
// }

// 構文は末尾！：identifier！です。識別子のタイプからnullおよびundefinedを削除します。
function fixed(name: string | null): string {
  function postfix(epithet: string | null): string {
    // return name!.charAt(0) + ".  the " + epithet; // ok
    // eslint no-non-null-assertionを入れている場合上の書き方でも怒られる
    return (name || "").charAt(0) + ".  the " + epithet; // ok
  }
  name = name || "Bob";
  return postfix("great");
}
console.log(fixed(null));

// 型エイリアス(Type Aliases)
// 型エイリアスは、型の新しい名前を作成します。
// 型エイリアスはインターフェースに似ている場合がありますが、
// プリミティブ型、共有体、タプル、その他の手作業で記述する必要のある型に名前を付けることができます。
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
  if (typeof n === "string") {
    return n;
  } else {
    return n();
  }
}
console.log(getName("hoge"));

// インターフェイスと同様に、型エイリアスもジェネリックにすることができます。
// 型パラメータを追加して、エイリアス宣言の右側で使用するだけです。
interface Container<T> {
  value: T;
}

// プロパティで自分自身を参照する型エイリアスを持つこともできます
interface Tree<T> {
  value: T;
  left: Tree<T>;
  right: Tree<T>;
}

// 交差型を併用すると、かなり心を折る型を作成できます
type LinkedList<T> = T & { next?: LinkedList<T> };

interface Human {
  name: string;
}

const humans: LinkedList<Human> = {
  name: "a",
  next: { name: "b", next: { name: "c", next: { name: "d" } } }
};
let human = humans;
console.log(human.name);
while (human.next) {
  human = human.next;
  console.log(human.name);
}

// ただし、型エイリアスを宣言の右式に同名のエイリアス名を表記することはできません。
// type Yikes = Array<Yikes>; // エラー

// インターフェイス vs 型エイリアス（Interfaces vs Type Aliases）
// 前述したように、型エイリアスはインターフェイスのように機能します。ただし、微妙な違いがいくつかあります。
// 違いの1つは、インターフェイスがどこでも使用される新しい名前を作成することです。
// 型エイリアスは新しい名前を作成しません。たとえば、エラーメッセージはエイリアス名を使用しません。
interface Alias {
  num: number;
}
interface Interface {
  num: number;
}
declare function aliased(arg: Alias): Alias;
declare function interfaced(arg: Interface): Interface;

// [Open–closed principle](https://www.typescriptlang.org/docs/handbook/advanced-types.html)に基づくと、
// （クラス、モジュール、関数などは拡張のために開かれるべきであるが、修正のために閉じられるべきであるという原則）
// 可能な場合は常に型エイリアスを介したインターフェイスを使用する必要があります。
// 一方、インターフェイスで何らかの形を表現できず、共有体型またはタプル型を使用する必要がある場合、通常は型エイリアスを使用します。

// 文字列リテラル型(String Literal Types)
// 文字列リテラル型を使用すると、文字列に必要な正確な値を指定できます。
// 実際には、文字列リテラル型は、共有体型、型ガード、および型エイリアスとうまく組み合わされます。
// これらの機能を併用すると、文字列で列挙型の動作を得ることができます。

// 文字列リテラル
type Easing = "ease-in" | "ease-out" | "ease-in-out";
class UIElement {
  public animate(dx: number, dy: number, easing: Easing): void {
    if (easing === "ease-in") {
      // ...
    } else if (easing === "ease-out") {
      // ...
    } else if (easing === "ease-in-out") {
      // ...
    } else {
      // error! should not pass null or undefined.
    }
  }
}

let btn = new UIElement();
btn.animate(0, 0, "ease-in");
// btn.animate(0, 0, "uneasy"); // エラー: "uneasy"は文字列リテラルに定義されていない

// 数値リテラル（Numeric Literal Type）
// TypeScriptは数値リテラルも持つことができます
function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {
  switch (Math.round(Math.random() * 5 + 1)) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 4;
    case 5:
      return 5;
    case 6:
      return 6;
    default:
      throw new Error("予期しない数値");
  }
}
console.log(rollDice());

// これらは明示的に記述されることはめったにないですが、型の絞り込みがバグをキャッチできる場合に役立ちます。
// function foo(x: number): void {
//   if (x !== 1 || x !== 2) {
//     // エラー：This condition will always return 'true' since the types '1' and '2' have no overlap.
//     // つまり、xが2と比較される場合、xは1でなければなりません。これは、上記のチェックが無効な比較を行うことを意味します。
//   }
// }

// 識別共有体型(Discriminated Union)
// シングルトン型、共有体型、型ガード、および型エイリアスを組み合わせて、識別共有体型と呼ばれる高度なパターンを作成できます。
// これは、タグ付き共有体または代数データ型とも呼ばれます。
// 関数型プログラミングで役立ちます。一部の言語では、Unionが自動的に区別されます。
// TypeScriptは、現在存在するJavaScriptパターンに基づいて構築されます。 3つの要素があります。

// 1.共通のシングルトン型プロパティを持つ型 — 判別式。
// 2.これらの型の和集合（和集合）をとる型エイリアス。
// 3.共通プロパティの型ガード。

// 最初に、結合するインターフェースを宣言します。各インターフェースには、異なる文字列リテラルタイプのkindプロパティがあります。
// kindプロパティは、判別式またはタグと呼ばれます。他のプロパティは各インターフェースに固有です。インターフェースは現在無関係であることに注意してください。
interface SquareBox {
  kind: "square";
  size: number;
}
interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}
interface Circle {
  kind: "circle";
  radius: number;
}

// 識別共有体でinterfaceを列挙する
type ShapeType = SquareBox | Rectangle | Circle;

// 識別共有体のkindに合わせて面積を計算する
function area(s: ShapeType): number {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
    case "rectangle":
      return s.height * s.width;
    case "circle":
      return Math.PI * s.radius ** 2;
  }
}
console.log(area({ kind: "square", size: 10 }));
console.log(area({ kind: "rectangle", width: 10, height: 5 }));
console.log(area({ kind: "circle", radius: 5 }));

// 網羅性チェック(Exhaustiveness checking)
// 識別共有体のすべてのバリエーションをカバーしていない場合、コンパイラーエラーになってほしいときがあります。
// たとえば、ShapeにTriangleを追加する場合、areaも更新する必要があります。

interface Triangle {
  kind: "triangle";
  width: number;
  height: number;
}

type ShapeType2 = SquareBox | Rectangle | Circle | Triangle;

// --strictNullChecksが有効の場合、switch文が完全ではなくなったため、エラーになります
// function area2(s: ShapeType2): number {
//   switch (s.kind) {
//     case "square":
//       return s.size * s.size;
//     case "rectangle":
//       return s.height * s.width;
//     case "circle":
//       return Math.PI * s.radius ** 2;
//   }
//   // エラーになってほしい - case "triangle"を処理してない
// }

// もうひとつの方法は、コンパイラが網羅性をチェックするためにnever型を使用します。
// 引数をnever型にしているのがポイント
function assertNever(x: never): never {
  throw new Error("予期しないオブジェクト：" + x);
}
// function area3(s: ShapeType2): number {
//   switch (s.kind) {
//     case "square":
//       return s.size * s.size;
//     case "rectangle":
//       return s.height * s.width;
//     case "circle":
//       return Math.PI * s.radius ** 2;
//     default:
//     // return assertNever(s); // エラー：ここにコンパイルチェックで到達するのはcaseの網羅性忘れ
//   }
// }

// 多様性this型(Polymorphic this types)
// 多様性this型は、包含クラスまたはインターフェースのサブタイプである型を表します。
// これは、F-boundedポリモーフィズムと呼ばれます。
// これにより、たとえば、階層的な流動的なインターフェースの表現がはるかに簡単になります。
// 各操作の後にthisを返す簡単な計算をします。

class BasicCalculator {
  protected value: number;
  public constructor(value: number = 0) {
    this.value = value;
  }
  public currentValue(): number {
    return this.value;
  }
  // 戻り値型にthisを返す（多様性this型）
  public add(operand: number): this {
    this.value += operand;
    return this;
  }
  public multiply(operand: number): this {
    this.value *= operand;
    return this;
  }
  // ... 他の操作をここに書く ...
}

const v1 = new BasicCalculator(2)
  .multiply(5)
  .add(1)
  .currentValue();
console.log(v1);

// クラスはthis型を継承することができ、子クラスは変更せずに古いメソッドを使用できます。
class ScientificCalculator extends BasicCalculator {
  public constructor(value = 0) {
    super(value);
  }
  public sin(): this {
    this.value = Math.sin(this.value);
    return this;
  }
  // ... 他の操作をここに書く ...
}

let v2 = new ScientificCalculator(2)
  .multiply(5)
  .sin()
  .add(1)
  .currentValue();
console.log(v2);

// インデックス型(Index types)
// インデックス型を使用すると、コンパイラに動的プロパティ名を使用するコードをチェックさせることができます。

// たとえば、一般的なJavascriptパターンは、次のようなオブジェクトからプロパティのサブセットを選択することです。
// function pluck(o, propertyNames) {
//   return propertyNames.map(n => o[n]);
// }

// インデックス型のクエリ演算子とインデックス付きアクセス演算子を使用して、
// TypeScriptでこの関数を記述して使用する方法は次のようになります。
function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
  return propertyNames.map((n: K): T[K] => o[n]);
}
interface Car {
  manufacturer: string;
  model: string;
  year: number;
}
let taxi: Car = {
  manufacturer: "Toyota",
  model: "Camry",
  year: 2014
};

// manufacturerとmodelプロパティを取得
let makeAndModel: string[] = pluck(taxi, ["manufacturer", "model"]);
// modelとyearプロパティを取得
let modelYear = pluck(taxi, ["model", "year"]);
console.log(makeAndModel);
console.log(modelYear);

// コンパイラーは、manufacturerとmodelが実際にCarのプロパティであることを確認します。
// この例では、いくつかの新しい型の演算子を紹介しています。
// 1つは、インデックス型のクエリ演算子であるkeyof Tです。
// 型Tの場合、keyof Tは、Tの既知のパブリックプロパティ名の結合です。次に例を示します。
let carProps: keyof Car; // 'manufacturer' | 'model' | 'year'の共有体型

// keyof Carは'manufacturer' | 'model' | 'year'の共有体型と完全に互換性がありますが、
// 違いはCarにownersAddress: stringなどの別のプロパティを追加した場合にkeyofも自動で更新されるところです。
// また、事前にプロパティ名を知ることができない場合、pluckなどの一般的なコンテキストでkeyofを使用できます。
// つまり、コンパイラは、pluckに正しいプロパティ名のセットを渡すことを確認します。

// 次のように存在していないプロパティを渡すとコンパイルエラーになります。
// pluck(taxi, ['year', 'unknown']); // unknownはkeyに定義されていない

// 2番目の演算子は、インデックス付きアクセス演算子T[K]です。
// ここで、型の構文は式の構文を反映しています。
// インデックス型のクエリ演算子と同様に、汎用コンテキストでT[K]を使用できます。
// 型変数Kがkeyof Tをextendsすることを確認する必要があります。
// getObjPropertyという名前の関数を使用した別の例を次に示します。

// getObjPropertyでは、o：TおよびpropertyName：Kであるため、o[propertyName]：T[K]を意味します。
// T[K]の結果を返すと、コンパイラはキーの実際の型をインスタンス化するため、
// getObjPropertyの戻り値の型は、要求するプロパティによって異なります。
function getObjProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
  return o[propertyName]; // o[propertyName]はT[K]型
}

// インデックス型とインデックスシグネチャ(Index types and index signatures)
// keyofとT[K]はインデックスシグネチャと相互作用します。
// インデックスシグネチャパラメーターの型は「string」または「number」でなければなりません。
// 文字列インデックスシグネチャを持つ型がある場合、keyof Tは文字列になります。
// JavaScriptでは、文字列（object['42']）または数字（object[42]）を使用してオブジェクトプロパティにアクセスできるため、単なる文字列ではありません。
// T[string]は単なるインデックスシグネチャの型です。

interface Dictionary1<T> {
  [key: string]: T;
}
let keys1: keyof Dictionary1<number> = "abc"; // string | number
let value1: Dictionary1<number>["foo"] = 1; // number
console.log(keys1);
console.log(value1);

// 数値インデックスシグネチャを持つ型がある場合、keyof Tは単なる数値になります。
interface Dictionary2<T> {
  [key: number]: T;
}
let keys2: keyof Dictionary2<number> = 3; // number
// let value2: Dictionary2<number>["foo"]; // エラー：プロパティ'foo'は型'Dictionary2<number>'に存在しません
let value3: Dictionary2<number>[42] = 10; // number
console.log(keys2);
console.log(value3);

// マップされた型（Mapped types）
// 既存の型を取得し、その各プロパティをオプショナルにしたいことがあります。
interface PersonPartial {
  name?: string;
  age?: number;
}
// もしくはreadonlyバージョンを作りたいことがあります
interface PersonReadonly {
  readonly name: string;
  readonly age: number;
}
// これはJavascriptで十分に頻繁に発生するため、TypeScriptは古い型（マップされた型）に基づいて新しい型を作成する方法を提供します。
// マップされた型では、新しい型が古い型の各プロパティを同じ方法で変換します。
// たとえば、型のすべてのプロパティを読み取り専用またはオプショナルにすることができます。

// これはユーティリティ型のReadonlyとPartialの定義です。
// type Readonly<T> = {
//   readonly [P in keyof T]: T[P];
// };
// type Partial<T> = {
//   [P in keyof T]?: T[P];
// };

// そして次のように使います
// type PersonPartial = Partial<Person>;
// type ReadonlyPerson = Readonly<Person>;

// メンバーを追加する場合は、交差型を使用できます。
// この構文は、メンバーではなく型を記述することに注意してください。
type PartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
} & { newMember: boolean };

// 次のように書いてはいけません
// これはエラーになります
// type PartialWithNewMember<T> = {
//   [P in keyof T]?: T[P];
//   newMember: boolean;
// }

// 最も単純なマップされた型とその部分を見てみましょう。
type Keys = "option1" | "option2";
type Flags = { [K in Keys]: boolean };

// 構文は、内部にfor ..があるインデックスシグネチャの構文に似ています。
// 1. 型変数Kは各変数に順番にバインドされます。
// 2. 反復処理するプロパティの名前を含む、文字列リテラル共有体型のKeysを指定します。
// 3. 値のプロパティの型を指定します。

// この簡単な例では、このマップされた型は次の記述と同等です。
// interface Flags {
//   option1: boolean;
//   option2: boolean;
// }

// 既存の型に基づいており、何らかの方法でプロパティを変換します。
// その場合はkeyofおよびインデックス付きアクセス型の出番です
// type Nullable<T> = { [P in keyof T]: T[P] | null };
// type Partial<T> = { [P in keyof T]?: T[P] };

// これらの例では、プロパティリストはkeyof Tであり、結果の型はT[P]の亜種です。
// これができるのは、マップされた型は一般的な使用に適したテンプレートであり、
// この種の変換が準同型であるためです。
// つまり、マッピングはTのプロパティにのみ適用され、他のプロパティには適用されないということです。
// コンパイラは、新しいプロパティ修飾子を追加する前に、既存のプロパティ修飾子をすべてコピーできることを知っています。
// たとえば、Person.nameがreadonlyの場合、Partial<Person>.nameはreadonlyでかつオプショナルです。

interface Proxy<T> {
  get(): T;
  set(value: T): void;
}
type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>;
};
function proxify<T>(o: T): Proxify<T> {
  let result: Partial<Proxify<T>> = {};
  for (const k in o) {
    result[k] = {
      get(): T[Extract<keyof T, string>] {
        return o[k];
      },
      set(value): void {
        o[k] = value;
      }
    };
  }
  return result as Proxify<T>;
}

let proxyProps = proxify({ a: 10, b: 20 });
proxyProps.a.set(30);
console.log(proxyProps.a.get());

// ReadonlyとPartialの他に標準ライブラリのユーティリティ型にはPick、Recordがあります
// type Pick<T, K extends keyof T> = {
//   [P in K]: T[P];
// };
// type Record<K extends keyof any, T> = {
//   [P in K]: T;
// };

// Readonly、Partial、Pickは準同型ですが、Recordはそうではありません。
// Recordが準同型ではないことの1つの手がかりは、プロパティをコピーするために入力型を使用しないことです
type ThreeStringProps = Record<"prop1" | "prop2" | "prop3", string>;
// 非準同型は基本的に新しいプロパティを作成するため、どこからでもプロパティ修飾子をコピーできません。

// マップされた型からの推論(Inference from mapped types)
// 型のプロパティをラップする方法がわかったので、次に行うことは、それらのラップを解除することです。
// このアンラップ推論は準同型マップ型でのみ機能することに注意してください。
// マップされた型が準同型でない場合は、ラップ解除関数に明示的な型パラメーターを指定する必要があります。

function unproxify<T, P>(t: Proxify<T>): T {
  let result: Partial<T> = {};
  for (const k in t) {
    result[k] = t[k].get();
  }
  return result as T;
}

let originalProps = unproxify(proxyProps);
console.log(originalProps);

// 条件付き型（Conditional Types）
// TypeScript 2.8には、非均一型マッピングを表現する機能を実現する条件付き型が導入されています。
// 条件付き型は、型関係テストとして表される条件に基づいて、2つの可能な型のいずれかを選択します。
// T extends U ? X : Y
// 上記の型は、TがUに割り当て可能な場合、型はXであり、それ以外の場合、型はYです。
// 条件付き型extends U ? X : YはXまたはYに即時評価されるか、条件が1つ以上の型変数に依存するために遅延評価されます。
// TまたはUに型変数が含まれる場合、XまたはYに即時評価するか、遅延評価するかは、
// 型システムにTが常にUに割り当て可能であると結論付けるのに十分な情報があるかどうかによって決まります

type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";

type U0 = TypeName<string>; // "string"
type U1 = TypeName<"a">; // "string"
type U2 = TypeName<true>; // "boolean"
type U3 = TypeName<() => void>; // "function"
type U4 = TypeName<string[]>; // "object"
const test0: U0 = "string"; // string型であれば"string"という文字しか割り当てできない
const test1: U1 = "string"; // string型であれば"string"という文字しか割り当てできない
const test2: U2 = "boolean"; // boolean型であれば"boolean"という文字しか割り当てできない
const test3: U3 = "function"; // function型であれば"function"という文字しか割り当てできない
const test4: U4 = "object"; // object型であれば"object"という文字しか割り当てできない
console.log(test0);
console.log(test1);
console.log(test2);
console.log(test3);
console.log(test4);

// 条件付き型が遅延評価される例
// 条件付き型関数の利用時に評価されます。
interface Foo {
  propA: boolean;
  propB: boolean;
}

function f<T>(x: T): T extends Foo ? string : number {
  // 型分岐（ブランチ）
  if (typeof x === "object" && "propsA" in x && "propsB" in x) {
    return JSON.stringify(x) as T extends Foo ? string : number;
  } else {
    return 0 as T extends Foo ? string : number;
  }
}

function foo<U>(x: U): void {
  // 外部からのxパラメータ指定時に遅延評価される
  let a = f(x);

  let b: string | number = a;
  console.log(b);
}
foo({ propsA: true, propsB: false });
foo("piyo");

// 上記では、変数aにはブランチをまだ選択していない条件型があります。別のコードがfooを呼び出すことになったとき
// Uで他の型に置き換えられ、TypeScriptは条件付き型を再評価して、実際にブランチを選択できるかどうかを判断します。

// 分配条件付き型（Distributive conditional types）
// 引数型が共有体型のパラメーターである条件付き型は、分散型条件付き型と呼ばれます。
// 分散条件付き型は、インスタンス化中に共用体型に自動的に分散されます。
// 例えば、A | B | C 引数型を取るT extends U ? X : YインスタンスのTは
// (A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)を解決します
type U5 = TypeName<string | (() => void)>; // "string" | "function"
type U6 = TypeName<string | string[] | undefined>; // "string" | "object" | "undefined"
type U7 = TypeName<string[] | number[]>; // "object"
const test5: U5 = "string";
const test6: U6 = "undefined";
const test7: U7 = "object";
console.log(test5);
console.log(test6);
console.log(test7);

// 条件付き型は、マップされた型と組み合わせると特に便利です。
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

interface Part {
  id: number;
  name: string;
  subparts?: Part[];
  updatePart(newName: string): void;
}

type U8 = FunctionPropertyNames<Part>; // "updatePart"
type U9 = NonFunctionPropertyNames<Part>; // "id" | "name" | "subparts"
type U10 = FunctionProperties<Part>; // { updatePart(newName: string): void }
type U11 = NonFunctionProperties<Part>; // { id: number, name: string, subparts: Part[] }
const test8: U8 = "updatePart";
const test9: U9 = "name";
const test10: U10 = {
  updatePart(newName: string): void {
    console.log(newName);
  }
};
const test11: U11 = { id: 1, name: "name" };
console.log(test8);
console.log(test9);
console.log(test10);
console.log(test11);

// 共有体型および交差型と同様に、条件型は自身を再帰的に参照することはできません。たとえば、次はエラーになります。
// type ElementType<T> = T extends any[] ? ElementType<T[number]> : T; // エラー

// 条件付き型の型推論(Type inference in conditional types)
// 条件付き型のextends句内で、推定される型変数を導入するinfer宣言を持つことが可能になりました。
// このような推論された型変数は、条件付き型の真のブランチで参照される場合があります。
// 同じ型変数に対して複数の推論場所を持つことが可能です。

// たとえば、ReturnTypeユーティリティ型は関数型の戻り値の型を抽出します。
// type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

// 条件型をネストして、順番に評価されるパターンマッチのシーケンスを形成できます。
type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

type V0 = Unpacked<string>; // string
type V1 = Unpacked<string[]>; // string
type V2 = Unpacked<() => string>; // string
type V3 = Unpacked<Promise<string>>; // string
type V4 = Unpacked<Promise<string>[]>; // Promise<string>
type V5 = Unpacked<Unpacked<Promise<string>[]>>; // string
const ret0: V0 = "string";
const ret1: V1 = "string";
const ret2: V2 = "string";
const ret3: V3 = "string";
// top-level-await、ES2019の文法
// https://github.com/tc39/proposal-top-level-await
const ret4: V4 = Promise.resolve("string");
const ret5: V5 = "string";
console.log(ret0);
console.log(ret1);
console.log(ret2);
console.log(ret3);
console.log(ret4);
console.log(ret5);

// 次の例は、inferがメソッドのリターン値として使われる場合
// そのinferの型は共有体型として推測されます
type Hoge<T> = T extends { a: infer U; b: infer U } ? U : never;
type Z0 = Hoge<{ a: string; b: string }>; // string
type Z1 = Hoge<{ a: string; b: number }>; // string | number
const inf0: Z0 = "abc";
const inf1: Z1 = "def";
const inf2: Z1 = 2;
console.log(inf0);
console.log(inf1);
console.log(inf2);

// 同様に、inferがメソッドのパラメータ値として使われる場合、
// 交差型として推測されます。
type Huga<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void }
  ? U
  : never;
type Z2 = Huga<{ a: (x: string) => void; b: (x: string) => void }>; // string
type Z3 = Huga<{ a: (x: string) => void; b: (x: number) => void }>; // string & number => never
const inf3: Z2 = "abc";
// const inf4: Z3 = "def" & 1; // エラー：ありえない
console.log(inf3);

// 複数の呼び出しシグネチャを持つ型（オーバーロードされた関数の型など）から推測する場合、最後のシグネチャから推測が行われます。
// 引数型のリストに基づいてオーバーロード解決を実行することはできません。
declare function piyo(x: string): number;
declare function piyo(x: number): string;
declare function piyo(x: string | number): string | number; // これが適用される
type Z4 = ReturnType<typeof piyo>; // string | number
const inf4: Z4 = "fin";
console.log(inf4);

// 通常の型パラメーターの制約句でinfer宣言を使用することはできません。
// type Return<T extends (...args: any[]) => infer R> = R;  // エラー：サポートしていません

// ただし、制約内の型変数を消去し、代わりに条件付きの型を指定することで、ほぼ同じ効果を得ることができます。
type AnyFunction = (...args: any[]) => any;
type Return<T extends AnyFunction> = T extends (...args: any[]) => infer R
  ? R
  : any;
