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
      return $s.Check(function(x){ return x === n; })
    },
    notEqualsTo: function(n){
      return $s.Check(function(x){ return x !== n; })
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
    }
  }
}();
