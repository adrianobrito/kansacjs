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

var smolder = function(){
  return {
    name: "smolder"
  }
};

describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(smolder === undefined).toBe(false);
  });
});
