describe("Smolder Matchers", function() {

  it("should check if is required or notNull", function() {
    var required = $m.required;
    var notNull = $m.required;

    var str = "Smolder Pivete!";
    var emptyString = "";

    expect(required.apply(str)).toBe(true);
    expect(required.apply(undefined)).toBe(false);
    expect(required.apply(null)).toBe(false);
    expect(required.apply(emptyString)).toBe(false);

  });

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

  it("should be equals to", function() {

  });

  it("should not be equals to", function() {

  });

  it("should check if is bewteen", function() {

  });

  it("should check if is before than", function() {

  });

  it("should check if is after than", function() {

  });

  it("should check if is after than", function() {

  });

  it("should check if is between(time)", function() {

  });

  it("should be email string", function() {

  });

  it("should be a regex pattern", function() {

  });

  it("should be a string with only number", function() {

  });

});
