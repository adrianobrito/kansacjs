/*{
  name: "Adriano",
  age: 15
}

var rule = {
  name: ['Nome', sm.minLength(5), sm.maxLength(10)], {{DEFINITION}}
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

function greaterThan(5){
  return function(object){ return object > 5; }
}

var Rule = function(definitions){

  this.definitions = definitions;

  function isValidFor = function(object){
    var invalidDefinitions = [];
    for(var d in definitions){
      var definition = definitions[d];
      if(definition instanceof Array){

      } else {
        var sentenceIsTrue = definition(object[d]);
        if(!sentenceIsTrue){
          invalidDefinitions.push(sentence.validationInformation());
        }
      }

    }
  }

};

var Validation = function(object){
  this.object = object;

  this.on = function(rules){
    this.rules = rules;
  };

  this.check = function(){}
  this.onSuccess = function(){}
  this.onError = function(){}

}

var smolder = {

  addRule: function(rule){
    if(!this.rules){
      this.rules = [];
    }

    this.rules.add(rule);
  },

  validate: function(object){
    return new Validation(object);
  }

};


var person = {name: "Name", surname: "Surname"};
