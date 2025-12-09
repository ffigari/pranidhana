export class Teacher {
  constructor(public name: string) {}

  sayHello() {
    return `Hello, I am Professor ${this.name}.`;
  }
}
