class Person {
  protected name: string;
  public constructor(name: string) {
    this.name = name;
  }
}

class Employee extends Person {
  private department: string;
  public address: string = "Tokyo";

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
