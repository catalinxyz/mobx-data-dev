import * as React from "react";
import "./styles.css";
import { observer } from "mobx-react-lite";
import { types } from "mobx-state-tree";
import {
  makeAutoObservable,
  makeObservable,
  observable,
  computed,
  action
} from "mobx";
import faker from "faker";

class Type<T> {
  name: string;
  TP: T;
  constructor(name) {
    this.name = name;
  }
}
function string(def?: string): Type<string> {
  return new Type<string>("string");
}

function maybe<T>(
  type: T,
  def?: T
): Type<T extends Type<infer X> ? X | undefined : T> {
  return new Type<T extends Type<infer X> ? X | undefined : T>("maybe");
}

type AttrMap = { [K: string]: Type<any> };
function attrs<T extends AttrMap>(
  map: T
): { [C in keyof T]: T[C] extends Type<infer X> ? X : never } {
  return (new Attrs(map) as unknown) as { [C in keyof T]: T[C]["TP"] };
}

class Attrs {
  meta = new Map();

  constructor(map: AttrMap) {
    Object.keys(map).forEach((key) => {
      this[key] = map[key];
    });

    makeAutoObservable(this);
  }
}
type ExtractAttrs<M extends typeof Model> = InstanceType<M>["attrs"];
type ExtractPartialAttrs<M extends typeof Model> = Partial<ExtractAttrs<M>>;
class Model {
  attrs = {};
  static create<T extends Model>(
    this: new () => T,
    attrs: Partial<T["attrs"]>
  ) {
    const instance = new this();
    makeObservable(instance as any, {});
    return instance;
  }

  setAttr<T extends Model>(name: T["attrs"]) {
    return name;
  }
}

function actions<T extends Model>(builder: (this: new () => T) => any) {
  
    return builder(this)
  
}
class User extends Model {
  attrs = attrs({
    name: string(),
    lastName: maybe(string())
  });

  change() {
    console.log("change");
    this.attrs.name = "CCC";
  }

  get fullName() {
    return 2;
  }
}
const u =User.create({});
u.setAttr("sad");
type k = keyof typeof u.attrs


abstract class BaseFactory<M extends typeof Model> {
  abstract model: M;
  abstract definition(): ExtractPartialAttrs<M>;
}

class UserFactory extends BaseFactory<typeof User> {
  model = User;

  definition() {
    return { name: faker.name.findName() };
  }
}

const c = new UserFactory();
const dd = c.definition();
console.log(dd);
const Todo = types.model({
  name: types.string,
  done: false,
  test: types.maybe(types.late(() => types.string))
});

// Todo.create();
// str()
// num()
// bool()
// date()
// ref() or model()
// array()
// map() ???

// nullable()
// maybe() //=> undefined?
// late(() => type)

const d = User.create({});

type c = Partial<typeof d.attrs>;
d.attrs;
// console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(d)))
// console.log(typeof d.fullName)
// console.log(Object.getOwnPropertyDescriptor(User.prototype, "fullName"));
// class Doubler {
//     value = 1

//     constructor(value) {
//         makeAutoObservable(this, {
//             value: observable,
//             double: computed,
//             increment: action
//         })
//         this.value = value
//     }

//     get double() {
//         return this.value * 2
//     }

//     increment() {
//         this.value++
//     }
// }

// const d = new Doubler(1);
const App = observer(() => {
  return (
    <div className="App">
      <h1>{d.attrs.name}</h1>
      <button onClick={() => d.change()}>change</button>
      <h2>{d.attrs.lastName}</h2>
    </div>
  );
});
export default App;
// function create() {
//   return
// }
