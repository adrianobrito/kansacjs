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
