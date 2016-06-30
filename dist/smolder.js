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
    Check: function(predicate, message){
      return {
        apply: function(){
          this.args = arguments;
          return predicate.apply(null, arguments);
        },
        withLabel: function(label){
          this.label = label;
          return this;
        },
        message: function(){
          var label = this.label;
          var formattedMessage = message;

          if(label){
            formattedMessage = formattedMessage.replace("$LABEL", label);
          }

          for(var a in this.args){
            formattedMessage = formattedMessage.replace("$" + (parseInt(a) + 1), this.args[a]);
          };

          return formattedMessage;
        }
      };
    },
    Definition: function(name, checks, label){
      this.name =  name;
      this.checks = checks;
      this.label = label;

      var extractProperty = function(json){
        return name === 'object' ? json : json[name];
      }

      this.check = function(checkedJson) {
        var checkedProperty = extractProperty(checkedJson);
        return checks.every(function(check){
          return check.withLabel(label).apply(checkedProperty);
        });
      };

      this.invalidChecksFor = function(checkedJson) {
        var checkedProperty = extractProperty(checkedJson);
        return checks.filter(function(check){
          return !check.withLabel(label).apply(checkedProperty);
        });
      }

    },
    Validation: function(definitions, checkedJson){
      return {
        isValid: function(){
          return definitions.every(function(def){ return def.check(checkedJson); });
        },
        isInvalid: function(){
          return !this.isValid();
        },
        apply: function(){
          var invalidDefinitions = definitions.filter(function(d){
            return !d.check(checkedJson);
          });

          var invalidCheckMessages = invalidDefinitions.map(function(def){
            return def.invalidChecksFor(checkedJson);
          });
          invalidCheckMessages = [].concat.apply([], invalidCheckMessages).map(function(check){
            return check.message();
          });

          if(this.isValid()){
            this.onSuccess();
          } else{
            this.onFail(invalidCheckMessages, invalidDefinitions);
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

    expect(validCheck.isValid()).toBe(true);
    expect(invalidCheck.isInvalid()).toBe(true);
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
