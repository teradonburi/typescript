// インタフェース定義をしない場合
function printLabel1(labeledObj: { label: string }): void {
  console.log(labeledObj.label);
}

let myObj1 = { size: 10, label: "Size 10 Object" };
printLabel1(myObj1);

// インタフェース定義をする場合
// インタフェース定義をするにはinterfaceキーワードを使う
interface LabeledValue {
  label: string; // プロパティ名と型を定義していく
}

function printLabel2(labeledObj: LabeledValue): void {
  console.log(labeledObj.label);
}

let myObj2 = { size: 10, label: "Size 20 Object" };
printLabel2(myObj2);

// オプショナルなプロパティを持つinterface
// オプショナルプロパティの利点は、これらの利用可能なプロパティを記述できると同時に、インターフェースの一部ではないプロパティの使用を防止できることです。
interface SquareConfig {
  color?: string; // 省略可能なプロパティは?をつける
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = { color: "white", area: 100 };
  if (config.color) {
    newSquare.color = config.color;
    // エラー: clorというプロパティはSquareConfigに定義されていない
    // newSquare.color = config.clor;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({ color: "black" });
console.log(mySquare);

// readonlyなプロパティ
interface Point {
  readonly x: number;
  readonly y: number;
}
const p1: Point = { x: 10, y: 20 }; // 初期化時はOK
// p1.x = 5; // エラー!
console.log(p1);

// readonlyな配列
// 配列にreadonlyをつけることで変更操作を一切封じることができます。
let a: number[] = [1, 2, 3, 4];
let ro: readonly number[] = a;
// ro[0] = 12; // エラー：要素に代入させない!
// ro.push(5); // エラー：配列に要素に影響を与えるメソッドは呼べない!
// ro.length = 100; // エラー：配列プロパティに代入させない！
// a = ro; // エラー：readonlyでない配列に代入させない!

// 通常、readonlyな配列を通常の配列に代入するのは違法だけど、型アサーションでキャストすることはできる
a = ro as number[];

// readonlyまたはconstのどちらを使用するかを覚える最も簡単な方法は、
// 変数で使用するかプロパティで使用するかを考えることです。
// 変数はconstを使用しますが、プロパティはreadonlyを使用します。

// 過剰プロパティチェック
// 型 '{ colour: string; width: number; }' の引数を型 'SquareConfig' のパラメーターに割り当てることはできません。
// オブジェクトリテラルで指定できるのは既知のプロパティのみですが、'colour' は型 'SquareConfig' に存在しません。書こうとしたのは 'color' ですか?
// let mySquare2 = createSquare({ colour: "red", width: 100 }); // エラー：存在しないプロパティを指定した場合にエラー

// 型アサーションでキャストして回避する方法もあるが・・・
//let mySquare3 = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);

// オブジェクトに特別な方法で使用される追加のプロパティがあることが確実な場合は、文字列インデックスシグネチャを使う
interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: any; // 文字列インデックスシグネチャ
}

// これらのチェックを回避する最後の方法は、少し驚くかもしれませんが、オブジェクトを別の変数に割り当てることです。
// squareOptionsは過剰なプロパティチェックを受けないため、コンパイラはエラーを表示しません。
let squareOptions = { colour: "red", width: 100 };
let mySquare4 = createSquare(squareOptions);
console.log(mySquare4);

// 上記のような単純なコードの場合、これらのチェックを「回避」しようとすべきではないことに注意してください。
// メソッドを持ち、状態を保持するより複雑なオブジェクトリテラルの場合、
// これらのテクニックを覚えておく必要があるかもしれませんが、
// 過剰なプロパティエラーの大部分は実際にはバグです。
// color、colourの両方をSquareConfigに渡してよい場合はinterface側で定義すべきです。

// 関数型(Function Types)
// 関数もinterface内に定義できます。引数の型とコロン:の後ろは戻り値の型を指定します。
interface SearchFunc {
  (source: string, subString: string): boolean;
}

// 定義したら、この関数型のインターフェースを他のインターフェースと同じように使用できます。
// ここでは、関数型の変数を作成して、同じ型の関数値を割り当てる方法を示します。
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string): boolean {
  let result = source.search(subString);
  return result > -1;
};
console.log(mySearch("Hello World!", "or"));

// インデックス可能な型(Indexable Types)
// インターフェースを使用して関数型を記述する方法と同様に、
// a[10]やageMap["daniel"]のように「インデックスを付ける」ことができる型を記述することもできます。

// インデックスシグネチャを持つStringArrayインターフェイスがあります。
// このインデックスシグネチャは、StringArrayが数値でインデックス付けされると、文字列を返すことを示しています。
interface StringArray {
  [index: number]: string;
}
let myArray1: StringArray;
myArray1 = ["Bob", "Fred"];

let myStr: string = myArray1[0];
console.log(myStr);

// サポートされているインデックスシグネチャには、文字列と数値の2種類があります。
// 両方のタイプのインデクサーをサポートすることは可能ですが、
// 数値インデクサーから返される型は、文字列インデクサーから返される型のサブタイプでなければなりません。
// これは、数値でインデックスを作成する場合、JavaScriptは実際にオブジェクトにインデックスを作成する前に文字列に変換するためです。
// つまり、100（数字）でのインデックス作成は "100"（文字列）でのインデックス作成と同じことなので、2つは一貫している必要があります。
class Animal {
  public name: string;
  public constructor(name: string) {
    this.name = name;
  }
}
class Dog extends Animal {
  public breed: string;
  public constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }
}

interface NotOkay {
  // [x: number]: Animal; // エラー：数値インデクサーは文字列インデクサーのサブタイプでなければならない
  [x: string]: Dog;
}

// 数値インデクサーが文字列インデクサーのサブタイプなのでOK
// そもそもインデクサーをサブタイプで異なったものを定義する場合はあまりないと思うが・・・
interface Okay {
  [x: string]: Animal;
  [x: number]: Dog;
}

// 文字列インデックスシグニチャは、「辞書」パターンを記述する強力な方法ですが、すべての他のプロパティが戻り値の型と一致することを強制します。
// これは、文字列インデックスがobj.propertyがobj["property"]としても利用可能であると宣言しているためです。
// 次の例では、nameの型は文字列インデックスの型と一致せず、型チェッカーはエラーを返します。
interface NumberDictionary {
  [index: string]: number;
  length: number; // OK：lengthはnumber
  // name: string; // エラー：nameはインデクサーのサブタイプではない
}

// ただし、インデックスシグネチャがUnion型である場合、異なる型のプロパティは受け入れられます。
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // OK：lengthはnumber
  name: string; // OK：nameはstring
}

// インデックスへの割り当てを防ぐために、インデックスシグネチャをreadonlyにすることができます
interface ReadonlyStringArray {
  readonly [index: number]: string;
}
let myArray2: ReadonlyStringArray = ["Alice", "Bob"];
//myArray2[2] = "Mallory"; // エラー：readonlyなので代入できない
console.log(myArray2);

// クラスの型（Class Types）
// C＃やJavaなどの言語のインターフェースの最も一般的な使用法の1つである、
// クラスがインタフェースの実装を満たすことを明示的に強制することは、TypeScriptでも可能です。
interface ClockInterface1 {
  currentTime: Date;
  setTime(d: Date): void;
}

// implementsキーワードでinterfaceを実装する
// currentTimeプロパティの存在とsetTimeの実装が保証される
class Clock implements ClockInterface1 {
  public currentTime: Date = new Date();
  public setTime(d: Date): void {
    this.currentTime = d;
  }
  public constructor() {}
}

const clock = new Clock();
clock.setTime(new Date());
console.log(clock.currentTime);

// コンストラクタシグネチャ
// コンストラクタの引数を定義することができます。
// クラスにインターフェースを使用する場合、クラスにはstatic型とインスタンス型の2つの型があります。
// クラス式で書くとシンプルにかけます。

// インスタンス型
interface ClockConstructor {
  // コンストラクタシグネチャはnewキーワードで定義する
  // static型を戻り値で返すようにする
  new (hour: number, minute: number): ClockInterface2;
}

// static型（クラスのプロパティの型）
interface ClockInterface2 {
  tick(): void;
}

// クラス式で定義する
const Clock2: ClockConstructor = class Clock implements ClockInterface2 {
  private h: number;
  private m: number;
  public constructor(h: number, m: number) {
    this.h = h;
    this.m = m;
  }
  public tick(): void {
    console.log("beep beep");
  }
};
// const clock2 = new Clock2(); // エラー：コンストラクターの引数が一致しない
const clock2 = new Clock2(10, 30);
clock2.tick();
console.log(clock2);

// インタフェースの継承（Extending Interfaces）
// インタフェースを継承することで既存のインタフェースを再利用し、一部のプロパティの型のみを拡張することができます。

interface Shape {
  color?: string;
}

interface PenStroke {
  penWidth?: number;
}

// extendsキーワードで継承したいinterfaceを指定します（,区切りで複数interface指定可能）
interface Square extends Shape, PenStroke {
  sideLength?: number;
}

let square: Square = {};
square.color = "blue";
square.penWidth = 5.0;
square.sideLength = 10;
console.log(square);

// ハイブリッド型（Hybrid Types）
// インターフェースは実際のJavaScriptに存在する豊富な型を記述することができます。
// JavaScriptの動的で柔軟な性質により、いくつかの型の組み合わせとして機能するオブジェクトに遭遇することがあります。
// 例えば、関数自体にメソッドやプロパティが定義されている、関数オブジェクトがハイブリット型に該当します。（ES6以前のクラスを使わない書き方など）
// サードパーティのJavaScriptとやり取りする場合、ハイブリット型を使用して、型の形状を完全に記述する必要があります。

interface Counter {
  // 関数オブジェクト(ハイブリット型)
  (start: number): string;
  // 関数オブジェクト内のプロパティやメソッド
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = function(start: number): string {
    return `${start}です`;
  } as Counter;
  counter.interval = 123;
  counter.reset = function(): void {
    console.log("reset");
  };
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
console.log(c);

// インターフェースのクラス継承（Interfaces Extending Classes）
// インターフェース型がクラス型を拡張すると、クラスのメンバーは継承されますが、実装は継承されません。
// インターフェースが実装を提供せずにクラスのすべてのメンバーを宣言したかのように振る舞います。
// インターフェースは、基本クラスのprivate,protectedされたメンバーも継承します。
// クラス継承したインタフェースを利用する場合は親クラスの継承も必須化されます。

class Control {
  protected state: string = "hello";
}

interface SelectableControl extends Control {
  select(): void;
}

class Button extends Control implements SelectableControl {
  public select(): void {
    console.log(this.state);
  }
}

// エラー：Controlクラスの継承が必須のため、stateがないと怒られる
// class IconButton implements SelectableControl {
//   public select(): void {
//     console.log(this.state);
//   }
// }

const button = new Button();
button.select();
