// 基本型(Basic Types)

// Boolean型：true, falseのみの型
let isDone = false;
console.log(isDone);

// Number型：数値の型
let decimal = 6; // 10進数
let hex = 0xf00d; // 16進数
let binary = 0b1010; // 2進数
let octal = 0o744; // 8進数
console.log(decimal);
console.log(hex.toString(16));
console.log(binary.toString(2));
console.log(octal.toString(8));

// String型：文字列の型（ダブルクォート、シングルクォート、バッククォートで囲まれた文字列）
let color = "blue";
color = "red";
const red = "#ff0000";
color = `${red}`;
console.log(color);

// Array型：配列の型
let list: number[] = [1, 2, 3];
// Array<number>のジェネリクスで書くこともできる
// let list: Array<number> = [1, 2, 3];
console.log(list);

// Tuple型：配列の型（別の型が入っている配列）
let x: [string, number];
// 初期化
x = ["hello", 10]; // OK：宣言の型と順番が一致する必要がある
// x = [10, "hello"]; // エラー：宣言の型と順番が一致する必要がある
console.log(x);

// Enum型：列挙型（省略した場合、0からインクリメントされた数値が列挙される）
enum Color1 {
  Red, // 0
  Green, // 1
  Blue // 2
}
let c1: Color1 = Color1.Green;
console.log(c1); // 1

// 個別に数値を振ることも可能
enum Color2 {
  Red = 1, // 0
  Green = 2, // 2
  Blue = 4 // 4
}
const c2: Color2 = Color2.Blue;
console.log(c2); // 4

// 文字列も指定できる
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}
const dir: Direction = Direction.Up;
console.log(dir);

// 列挙化型に割り当てられる値
// 1.リテラル列挙式（基本的には文字列リテラルまたは数値リテラル）
// 2.以前に定義された定数列挙型メンバーへの参照（異なる列挙型から発生する場合があります）
// 3.括弧で囲まれた定数列挙式
// 4.定数列挙式に適用される+、-、〜単項演算子のいずれか
// 5.+、-、*、/、％、<<、>>、>>>、＆、|、^オペランドとして定数列挙式を持つ二項演算子
// 定数列挙式がNaNまたはInfinityに評価されると、コンパイル時エラーになります。
enum FileAccess {
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  G = "123".length
}
console.log(FileAccess);

// Any型：どんな型でも入れることができる。
// サードパーティの型定義がないライブラリを使うときや、既存のJSプロジェクトをマイグレーションする時に主に使う
// 型定義の意味がなくなるので、最終的にはリファクタリングしたい
// TypeScriptのコンパイルチェックが実質体をなさなくなるので、実行時にエラーになる可能性がある
let notSure: any = 4;
// notSure.ifItExists(); // Error：コンパイルチェックは通るが、ifItExistsは存在しないので実行時エラーになる
notSure.toFixed(2); // OK：このタイミングではnotSureは数値型なので実行できる（ただし、コンパイルチェックはされない）
notSure = "maybe a string instead";
notSure = false;
console.log(notSure);

// any型の配列は様々な型が入っているデータが許されてしまう
let li: any[] = [1, true, "free"];
li[1] = 100;

// 関数型
// 引数の型とコロン:の後ろは戻り値の型を指定します。
function add(x: number, y: number): number {
  return x + y;
}
console.log(add(1, 2));

// ?で省略可能な引数を指定できる
function buildName(firstName: string, lastName?: string): string {
  if (lastName) return firstName + " " + lastName;
  else return firstName;
}

const result1 = buildName("Bob", "Adams"); // OK
// const result2 = buildName("Bob", "Adams", "Sr."); // エラー：引数が多すぎます
const result3 = buildName("Bob"); // OK
console.log(result1);
console.log(result3);

// 可変長引数の場合、配列型を指定します
function concatName(firstName: string, ...restOfName: string[]): string {
  return firstName + " " + restOfName.join(" ");
}

// 関数型の変数
const buildNameFun: (fname: string, ...rest: string[]) => string = concatName;
console.log(buildNameFun("FirstName", "MiddleName", "LastName"));

// Void型：関数の戻り値を返さないときに指定する型
function warnUser(): void {
  console.log("This is my warning message");
}
warnUser();

// void型の変数を作成する意味はない（undefinedもしくはnullしか割り当てができないため）
let unusable: void = undefined;
// unusable = null; // --strictNullChecksオプションがついている場合、undefinedとnullの混在はできない
console.log(unusable);

// undefined型、null型、単独でundefined、nullしか割り当てできない
// それゆえ実質単独での使いみちはあまりない
// let u: undefined = undefined;
// let n: null = null;
// console.log(u);
// console.log(n);

// デフォルトでは、nullおよびundefinedは他のすべての型のサブタイプです。
// つまり、数値のようなものにnullとundefinedを割り当てることができます。
// ただし、-strictNullChecksフラグを使用する場合、nullおよびundefinedは許されません。
// これにより、多くの一般的なエラーを回避できます。
// let num: number = 1;
// num = null; // エラー：-strictNullChecksフラグを使用する場合は数値型にnull代入が許されない
// console.log(num);

// 文字列、null、または未定義のいずれかを渡したい場合は、Union型を使用できます。
// Union型は|で代入されうる型を連結させます。
let str: string | null | undefined = undefined;
str = null;
str = "文字列";
console.log(str);

// Never型：never型は常に例外をスローする関数または例外でreturn文が呼ばれない関数の戻り値として使います。
// never型はすべての型のサプタイプであるが、値を割り当てすることはできません。

// 関数がreturnに到達せず、常に例外を返す場合にnever型を使います。
function error(message: string): never {
  throw new Error(message);
}
try {
  error("エラーです");
} catch (error) {
  console.log(error);
}

// 実際使う場合は意識する必要はあまりない（すべての型のサブタイプなのでUnionする必要もない）
function exec(message: string): string {
  if (message === "err") {
    throw new Error(message);
  }
  return message;
}
console.log(exec("テスト"));

// Object型：Object型は非プリミティブ型です。
// つまり、number、string、boolean、symbol、nullまたはundefinedではないものを表す型です。
// Object型を使用すると、Object.createなどのAPIをより適切に表現できます。
function create(o: object): void {
  console.log(o);
}

create({ prop: 0 }); // OK
// create(42); // エラー
// create("string"); // エラー
// create(false); // エラー
// create(null); // エラー
// create(undefined); // エラー

// Object、{}、object型の違い
// 参考：https://blog.yux3.net/entry/2017/06/08/202859
// let o1: Object;
// let o2: object;
// let o3: {};
// 通常よく使うのはo3: {}ですが、部分的構造化による弱い型付けのため、意図しない型が入る可能性があります。
// object型と{}型：https://qiita.com/uhyo/items/e2fdef2d3236b9bfe74a#object%E5%9E%8B%E3%81%A8%E5%9E%8B
// 後述のinterfaceを使ったほうが良いです。

// 型アサーション
// 型アサーションは、他の言語での型キャストに似ていますが、違う点はデータの特別なチェックや再構築は行いません。
// ランタイムに影響はなく、純粋にコンパイラーによって使用されます。

let someValue: any = "this is a string";
// any型をasスタイルでstring型に型キャストする
let strLength: number = (someValue as string).length;
// 次のように山括弧で囲うスタイルもあるが、JSXではasスタイルでの型キャストしか許可されていない
// let strLength: number = (<string>someValue).length;
console.log(strLength);
