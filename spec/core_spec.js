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
      return n < 30;
    });

    var validPerson = {
      name: "Random name", age: 15
    };

    var invalidPerson = {
      name: "Random name", age: 48
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
      return n < 30;
    });

    var validPerson = {
      name: "Random name", age: 15
    };

    var invalidPerson = {
      name: "Random name", age: 48
    };

    var personRule = {
      age: [lessThanThird, greaterThanTen]
    };

    var rule = smolder.createRule('personRule', personRule);
    var validCheck = rule.check(validPerson);
    var invalidCheck = rule.check(invalidPerson);

    expect(validCheck.isValid()).toBe(true);
    expect(!validCheck.isValid()).toBe(false);
  });


  it("should validate through Validation promise objects", function(){
    var greaterThanTen = smolder.Check(function(n){
      return n > 10;
    });

    var lessThanThird = smolder.Check(function(n){
      return n < 30;
    });

    var invalidPerson = {
      name: "Random name", age: 48
    };

    var personRule = {
      age: [lessThanThird, greaterThanTen]
    };

    var rule = smolder.createRule('personRule', personRule);
    var invalidCheck = rule.check(invalidPerson);

    invalidCheck.onFail(function(definitions){
      expect(definitions.length > 0).toBe(true);
    });

    invalidCheck.apply();

  });

  it("should create rule objects with labels", function(){
    var greaterThanTen = smolder.Check(function(n){
      return n > 10;
    });

    var lessThanThird = smolder.Check(function(n){
      return n < 30;
    });

    var invalidPerson = {
      name: "Random name", age:  48
    };

    var personRule = {
      age: ["Age", lessThanThird, greaterThanTen]
    };

    var rule = smolder.createRule('personRule', personRule);
    var invalidCheck = rule.check(invalidPerson);
    invalidCheck.onFail(function(definitions){
      definitions.forEach(function(d){;
        expect(d.label !== undefined && d.label !== null).toBe(true);
      });
    });

    invalidCheck.apply();

  });

});
