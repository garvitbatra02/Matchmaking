
class Person {
    constructor(name, placeOfBirth, dayOfBirth, monthOfBirth, yearOfBirth, hourOfBirth, minuteOfBirth, secondOfBirth, amPm) {
      this.name = name;
      this.placeOfBirth = placeOfBirth;
      this.dayOfBirth = dayOfBirth;
      this.monthOfBirth = monthOfBirth;
      this.yearOfBirth = yearOfBirth;
      this.timeOfBirth = {
        hour: hourOfBirth,
        minute: minuteOfBirth,
        second: secondOfBirth,
        amPm: amPm
      };
    }
  
    getFullDateOfBirth() {
      return `${this.dayOfBirth}-${this.monthOfBirth}-${this.yearOfBirth}`;
    }
  
    getFullTimeOfBirth() {
      return `${this.timeOfBirth.hour}:${this.timeOfBirth.minute}:${this.timeOfBirth.second} ${this.timeOfBirth.amPm}`;
    }
  }
  
  export default Person;
  