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
  return {
    Check: function(predicate){
      return predicate;
    },
    Definition: function(name, checks){
      this.name =  name;
      this.checks = checks;

      this.check = function(checkedJson){
        var individualCheck = function(check){
          return check(checkedJson);
        };

        return checks.every(individualCheck);
      };

    },
    Validation: function(ruleCheck){
      return {
        onSucess: function(onSucess){

        }
      }
    },
    Rule: function(name, definitions){

      return {
        name: name,
        check: function(){

        }
      };

    }
  }
}();
