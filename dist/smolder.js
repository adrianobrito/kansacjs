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
    },
    rule: function(name){
      return rules[name];
    }
  }
}();

var $m = smolder.matchers = function(){
  return {
    falseCheck: $s.Check(function(){ return false; }),
    required: $s.Check(function(n){
      var result = true;
      if(typeof n === 'string'){
        result &= (n.length > 0);
      }

      result &= (n !== undefined && n !== null);
      return Boolean(result);
    }),
    notNull: this.required,
    greaterThan: function(n){
      return $s.Check(function(x){ return x > n; });
    },
    greaterOrEqualsThan: function(n){
      return $s.Check(function(x){ return x >= n; });
    },
    lessThan: function(n){
      return $s.Check(function(x) { return x < n; });
    },
    lessOrEqualsThan: function(n){
      return $s.Check(function(x) { return x <= n; });
    },
    equalsTo: function(n){
      return $s.Check(function(x){ return x === n; });
    },
    notEqualsTo: function(n){
      return $s.Check(function(x){ return x !== n; });
    },
    between: function(x,y){
      if(!x || !y){
        return this.falseCheck;
      }

      if(x instanceof Date && y instanceof Date){
        return $s.Check(function(n){
          var time = n.getTime();
          var xTime = x.getTime();
          var yTime = y.getTime();

          return xTime <= time && time <= yTime;
        });
      } else if(typeof(x) === "number" && typeof(y) === "number"){
        return $s.Check(function(n){
          return x <= n && n <= y;
        });
      } else{
        return this.falseCheck;
      }
    },
    before: function(d){
      return $s.Check(function(x){
        if((!x instanceof Date) && (!y instanceof Date)){
          return false;
        }

        return x.getTime() < d.getTime();
      });
    },
    after: function(d){
      return $s.Check(function(x){
        if((!x instanceof Date) && (!y instanceof Date)){
          return false;
        }

        return x.getTime() > d.getTime();
      });
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

describe("Smolder Matchers", function() {

  it("should check if is required or notNull", function() {
    var required = $m.required;
    var notNull = $m.required;

    var str = "Smolder Pivete!";
    var emptyString = "";

    expect(required.apply(str)).toBe(true);
    expect(required.apply(undefined)).toBe(false);
    expect(required.apply(null)).toBe(false);
    expect(required.apply(emptyString)).toBe(false);

  });

  it("should check if is greater than", function() {
    var greaterThanTen = $m.greaterThan(10);

    expect(greaterThanTen.apply(9)).toBe(false);
    expect(greaterThanTen.apply(10)).toBe(false);
    expect(greaterThanTen.apply(11)).toBe(true);
  });

  it("should check if is less than", function() {
    var lessThanTen = $m.lessThan(10);

    expect(lessThanTen.apply(9)).toBe(true);
    expect(lessThanTen.apply(10)).toBe(false);
    expect(lessThanTen.apply(11)).toBe(false);
  });

  it("should be equals to", function() {
    var equalsToTen = $m.equalsTo(10);

    expect(equalsToTen.apply(9)).toBe(false);
    expect(equalsToTen.apply(10)).toBe(true);
    expect(equalsToTen.apply(11)).toBe(false);
  });

  it("should not be equals to", function() {
    var notEqualsToTen = $m.notEqualsTo(10);

    expect(notEqualsToTen.apply(9)).toBe(true);
    expect(notEqualsToTen.apply(10)).toBe(false);
    expect(notEqualsToTen.apply(11)).toBe(true);
  });

  it("should check if is bewteen", function() {
    var betweenOneAndThree = $m.between(1, 3);

    expect(betweenOneAndThree.apply(1)).toBe(true);
    expect(betweenOneAndThree.apply(2)).toBe(true);
    expect(betweenOneAndThree.apply(3)).toBe(true);
    expect(betweenOneAndThree.apply(4)).toBe(false);
  });

  it("should check if is before than", function() {
    var oneDayInMilis = 86400 * 1000;
    var today = new Date();
    var yesterday = new Date(Date.now() - oneDayInMilis);
    var tomorrow = new Date(Date.now() + oneDayInMilis);

    var beforeToday = $m.before(today);
    expect(beforeToday.apply(yesterday)).toBe(true);
    expect(beforeToday.apply(tomorrow)).toBe(false);
  });

  it("should check if is after than", function() {
    var oneDayInMilis = 86400 * 1000;
    var today = new Date();
    var yesterday = new Date(Date.now() - oneDayInMilis);
    var tomorrow = new Date(Date.now() + oneDayInMilis);

    var afterToday = $m.after(today);
    expect(afterToday.apply(yesterday)).toBe(false);
    expect(afterToday.apply(tomorrow)).toBe(true);
  });

  it("should check if is between(time)", function() {
    var oneDayInMilis = 86400 * 1000;
    var twoDayInMilis = 2 * 86400 * 1000;
    var today = new Date();
    var twoDaysBeforeToday = new Date(Date.now() - twoDayInMilis);
    var tomorrow = new Date(Date.now() + oneDayInMilis);
    var twoDaysAfterToday = new Date(Date.now() + twoDayInMilis);

    var betweenDates = $m.between(today, twoDaysAfterToday);
    expect(betweenDates.apply(today)).toBe(true);
    expect(betweenDates.apply(tomorrow)).toBe(true);
    expect(betweenDates.apply(twoDaysAfterToday)).toBe(true);
    expect(betweenDates.apply(twoDaysBeforeToday)).toBe(false);
  });

  it("should be email string", function() {
    var validMail = "user@mailserv.er";
    var invalidEmail = "ultra user @ google.com pastor o pai";

    var isEmail = $m.email();
    expect(isEmail.apply(validMail)).toBe(true);
    expect(isEmail.apply(invalidEmail)).toBe(false);
  });

  it("should be a regex pattern", function() {
    var alphanumericString = "7432dsandjqa848231u4";
    var nonAlphaNumericString = "%¨%%@%@$#$%!¨!";
    var alphanumericRegex = /^\w+$/;

    var isAlphaNumeric = $m.regex(/^\w+$/);
    expect(isAlphaNumeric.apply(alphanumericString)).toBe(true);
    expect(isAlphaNumeric.apply(nonAlphaNumericString)).toBe(false);
  });

  it("should be a numbered string", function() {
    var onlyNumbers = "472389472389";
    var anyNumbers = "hdjashdkas";
    var someNumbers = "hdjash534534dkas";

    var isNumber = $m.number();
    expect(isNumber.apply(onlyNumbers)).toBe(true);
    expect(isNumber.apply(someNumbers)).toBe(false);
    expect(isNumber.apply(anyNumbers)).toBe(false);
  });

  it("should be possible to create new checkers", function(){
    $m.create('odd', function(number){ return number % 2 === 1;  });

    var oddNumber = 1;
    var pairNumber = 2;
    var isOdd = $m.odd();

    expect(isOdd.apply(oddNumber)).toBe(true);
    expect(isOdd.apply(oddNumber)).toBe(false);
  });

});
