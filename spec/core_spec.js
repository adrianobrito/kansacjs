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
