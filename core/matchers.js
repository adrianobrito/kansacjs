var $m = smolder.matchers = function(){
  return {
    required: $s.Check(function(n){

    }),
    greaterThan: $s.Check(function(n){
      return function(x) { return x > n; }
    }),
    greaterOrEqualsThan: $s.Check(function(n){
      return function(x) { return x => n; }
    }),
    lessThan: $s.Check(function(n){
      return function(x) { return x < n; }
    }),
    lessOrEqualsThan: $s.Check(function(n){
      return function(x) { return x <= n; }
    })
  }
}();
