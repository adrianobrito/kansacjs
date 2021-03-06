describe("Smolder", function() {

  it("should create Check objects", function() {
    var greaterThanTen = smolder.Check(function(n){
      return n > 10;
    });

    expect(greaterThanTen.apply(9)).toBe(false);
    expect(greaterThanTen.apply(10)).toBe(false);
    expect(greaterThanTen.apply(11)).toBe(true);
  });

  it("should create Check objects with messages", function() {
    var greaterThanTen = smolder.Check(function(n){
      return n > 10;
    }, "The age has a value greater than 10: $1");

    greaterThanTen.apply(11);
    expect(greaterThanTen.message()).toBe("The age has a value greater than 10: 11");
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
    }, "The age has a value greater than 10: $1");

    var lessThanThird = smolder.Check(function(n){
      return n < 30;
    }, "The age has a value greater than 30: $1");

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
    var referencedRule = smolder.rule('personRule');

    expect(validCheck.isValid()).toBe(true);
    expect(invalidCheck.isInvalid()).toBe(true);
    expect(rule).toBe(referencedRule);
  });


  it("should validate through Validation promise objects", function(){
    var greaterThanTen = smolder.Check(function(n){
      return n > 10;
    }, "The age has a value greater than 10: $1");

    var lessThanThird = smolder.Check(function(n){
      return n < 30;
    }, "The age has a value greater than 30: $1");

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
    }, "The $LABEL should be greater than 10. Current value: $1");

    var lessThanThird = smolder.Check(function(n){
      return n < 30;
    }, "The $LABEL should be less than 30. Current value: $1");

    var invalidPerson = {
      name: "Random name", age:  48
    };

    var personRule = {
      age: ["Age", lessThanThird, greaterThanTen]
    };

    var rule = smolder.createRule('personRule', personRule);
    var invalidCheck = rule.check(invalidPerson);
    invalidCheck.onFail(function(checkMessages, definitions){
      definitions.forEach(function(d){;
        expect(d.label !== undefined && d.label !== null).toBe(true);
      });

      expect(checkMessages.length).toBe(1);
      expect(checkMessages[0]).toBe("The Age should be less than 30. Current value: 48");
    });

    invalidCheck.apply();

  });

  it("should create definition in a rule for entire JSON object", function(){
    var generalCheck = smolder.Check(function(n){
      return n.age < 30 && n.name.indexOf("R") == -1;
    }, "The $LABEL should be newer than 30 and cannot have R in name.");

    var invalidPerson = {
      name: "Random name", age:  48
    };

    var personRule = {
      object: ["Person", generalCheck]
    };

    var rule = smolder.createRule('personRule', personRule);
    var invalidCheck = rule.check(invalidPerson);
    invalidCheck.onFail(function(checkMessages, definitions){
      definitions.forEach(function(d){;
        expect(d.label !== undefined && d.label !== null).toBe(true);
      });

      expect(checkMessages.length).toBe(1);
      expect(checkMessages[0]).toBe("The Person should be newer than 30 and cannot have R in name.");
    });

    invalidCheck.apply();
  });

});
