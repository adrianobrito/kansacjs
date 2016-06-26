describe("Smolder", function() {

  it("should create Check objects", function() {
    var greaterThanTen = smolder.Check(function(n){
      return n > 10;
    });

    expect(greaterThanTen(9)).toBe(false);
    expect(greaterThanTen(10)).toBe(false);
    expect(greaterThanTen(11)).toBe(true);
  });

  it("should create Definition objects", function() {
    var greaterThanTen = smolder.Check(function(n){
      return n > 10;
    });

    var lessThanThird = smolder.Check(function(n){
      return n > 30;
    });

    var validPerson = {
      name: "Random name", age: 15;
    };

    var invalidPerson = {
      name: "Random name", age: 48;
    };

    var definition = new smolder.Definition('age', [greaterThanTen, lessThanThird]);
    expect(definition.check(validPerson)).toBe(true);
    expect(definition.check(invalidPerson)).toBe(false);
  });

  it("should create rule objects", function(){
    var greaterThanTen = smolder.Check(function(n){
      return n > 10;
    });

    var lessThanThird = smolder.Check(function(n){
      return n > 30;
    });

    var validPerson = {
      name: "Random name", age: 15;
    };

    var invalidPerson = {
      name: "Random name", age: 48;
    };

    var personRule = {
      age: [lessThanThird, greaterThanTen]
    };

    var rule = smolder.createRule('personRule', personRule);

    expect(rule.check(validPerson)).toBe(true);
    expect(rule.check(validPerson)).toBe(false);
  });

});
