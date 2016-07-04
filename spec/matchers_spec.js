describe("Smolder Matchers", function() {

  it("should check if is greater than", function() {
    var greaterThanTen = $m.greaterThan(10);

    expect(greaterThanTen.apply(9)).toBe(false);
    expect(greaterThanTen.apply(10)).toBe(false);
    expect(greaterThanTen.apply(11)).toBe(true);
  });

  it("should check if is less than", function() {
    var lessThanTen = $m.lessThan(10);

    expect(lessThanTen.apply(9)).toBe(true);
    expect(lessThanTen.apply(10)).toBe(false);
    expect(lessThanTen.apply(11)).toBe(false);
  });

});
