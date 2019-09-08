// public, protected, privateのアクセッサが使える
// protected, privateはTypeScript固有の機能
class Person {
  protected name: string; // 継承先からは参照できるけど、外部公開はしない
  public constructor(name: string) {
    this.name = name;
  }
}

class Employee extends Person {
  private department: string;
  public readonly address: string = "Tokyo"; // readonly

  public constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  public getElevatorPitch(): string {
    // protectedメンバとprivateメンバは参照できる
    return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
// console.log(howard.department); // エラー：departmentはprivateメンバなため、外部から参照できない
// console.log(howard.name); // エラー：nameはprotectedメンバなため、外部から参照できない
console.log(howard.address); // OK：addressはpublicメンバなため、外部から参照できる
// howard.address = "Osaka"; // エラー：readonlyなため代入できない

// 抽象クラス（Abstract Classes）
// abstractキーワードを使うことで継承後のクラスで実装予定のメンバ変数やメソッドを定義できる
// 抽象クラスはインスタンス化できないが、継承後のクラスをダウンキャストして使うことができる（実装の隠蔽化、ポリモーフィズム）

// 抽象クラス
abstract class Department {
  private name: string;
  public constructor(name: string) {
    this.name = name;
  }

  public printName(): void {
    console.log("Department name: " + this.name);
  }

  abstract printMeeting(): void; // must be implemented in derived classes
}

class AccountingDepartment extends Department {
  public constructor() {
    super("Accounting and Auditing"); // constructors in derived classes must call super()
  }

  public printMeeting(): void {
    console.log("The Accounting Department meets each Monday at 10am.");
  }

  public generateReports(): void {
    console.log("Generating accounting reports...");
  }
}

let department: Department; // OK：抽象クラスの参照はできる
// department = new Department(); // エラー: 抽象クラスのインスタンスが生成できない
department = new AccountingDepartment(); // OK： 非中朝クラスのインスタンスは生成でき、抽象クラスにダウンキャストする
department.printName();
department.printMeeting();
// department.generateReports(); // エラー: このメソッドは抽象クラスでは定義されていない
