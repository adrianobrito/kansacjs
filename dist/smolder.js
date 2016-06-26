/*{
  name: "Adriano",
  age: 15
}

var rule = {
  name: ['Nome', sm.minLength(5), sm.maxLength(10)], {{DEFINITION [CHECKS]}}
  age: sm.greaterThan(18), {{DEFINITION}}
  object: function() {{DEFINITION}}
}

Define the rules in a external context. And them apply them.

$s('validatePerson')
* smolder.addRule('validatePerson', rule);
* var validation = smolder.check('validatePerson', object);
* validation.then(function(){});
* validation.onSucess(function(source){});.
* validation.onFail(function(messages){})

* validation.
* smolder.

*/
var $s = smolder = function(){
  var rules = {};

  var individualCheck = function(check){
    return check(checkedJson);
  };

  return {
    Check: function(predicate){
      return predicate;
    },
    Definition: function(name, checks, label){
      this.name =  name;
      this.checks = checks;
      this.label = label;

      this.check = function(checkedJson){
        return checks.every(function(check){ return check(checkedJson[name]); });
      };

    },
    Validation: function(definitions, checkedJson){
      return {
        isValid: function(){
          return definitions.every(function(def){ return def.check(checkedJson); });
        },
        apply: function(){
          var invalidDefinitions = definitions.filter(function(d){
            return !d.check(checkedJson);
          });

          if(this.isValid()){
            this.onSuccess();
          } else{
            this.onFail(invalidDefinitions);
          }
        },
        onSuccess: function(onSuccess){
          this.onSuccess = onSuccess;
        },
        onFail: function(onFail){
          this.onFail = onFail;
        }
      }
    },
    Rule: function(name, definitions){
      return {
        name: name,
        check: function(checkedJson){
          return new smolder.Validation(definitions, checkedJson);
        }
      };
    },
    createRule: function(name, rule){
      var definitions = [];
      for(var r in rule){
        var currentDefinition = rule[r];
        if(typeof currentDefinition[0] === "string"){
          definitions.push(new smolder.Definition(r, rule[r].slice(1, rule[r].length), currentDefinition[0]));
        } else{
          definitions.push(new smolder.Definition(r, rule[r]));
        }
      }

      rules[name] = smolder.Rule(name, definitions);
      return rules[name];
    }
  }
}();

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
