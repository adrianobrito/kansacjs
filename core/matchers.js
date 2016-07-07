var $m = smolder.matchers = function(){
  return {
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
    }
  }
}();
