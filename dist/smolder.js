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
var $s = smolder = function(){
  return {
    Check: function(predicate){

      this.check = function(value){
        return predicate(value);
      }

    }
  }
}();

describe("Smolder", function() {

  it("should create Check objects", function() {
    var greaterThanTen = new smolder.Check(function(n){
      return n > 10;
    });

    expect(greaterThanTen.check(9)).toBe(false);
    expect(greaterThanTen.check(10)).toBe(false);
    expect(greaterThanTen.check(11)).toBe(true);
  });

});
