/*{
  name: "Adriano",
  age: 15
}

{
  name: [sm.minLength(5), sm.maxLength(10)],
  age: sm.greaterThan(18),
  object: function()
}
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
        var sentence = definition(object[d]);
        if(!sentence.check()){
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
