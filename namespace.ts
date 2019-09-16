import { com } from "./types/interface";
// namespaceのエイリアス
import TestModel = com.model.TestModel ;

const my: TestModel = { title: "test", age: 10 };
console.log(my);
