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
    var equalsToTen = $m.equalsTo(10);

    expect(equalsToTen.apply(9)).toBe(false);
    expect(equalsToTen.apply(10)).toBe(true);
    expect(equalsToTen.apply(11)).toBe(false);
  });

  it("should not be equals to", function() {
    var notEqualsToTen = $m.notEqualsTo(10);

    expect(notEqualsToTen.apply(9)).toBe(true);
    expect(notEqualsToTen.apply(10)).toBe(false);
    expect(notEqualsToTen.apply(11)).toBe(true);
  });

  it("should check if is bewteen", function() {
    var betweenOneAndThree = $m.between(1, 3);

    expect(notEqualsToTen.apply(1)).toBe(true);
    expect(notEqualsToTen.apply(2)).toBe(true);
    expect(notEqualsToTen.apply(3)).toBe(true);
    expect(notEqualsToTen.apply(3)).toBe(false);
  });

  it("should check if is before than", function() {
    var oneDayInMilis = 86400 * 1000;
    var today = new Date();
    var yesterday = new Date(Date.now() - oneDayInMilis);
    var tomorrow = new Date(Date.now() + oneDayInMilis);

    var beforeToday = $m.before(today);
    expect(beforeToday.apply(yesterday)).toBe(true);
    expect(beforeToday.apply(tomorrow)).toBe(false);
  });

  it("should check if is after than", function() {
    var oneDayInMilis = 86400 * 1000;
    var today = new Date();
    var yesterday = new Date(Date.now() - oneDayInMilis);
    var tomorrow = new Date(Date.now() + oneDayInMilis);

    var afterToday = $m.after(today);
    expect(afterToday.apply(yesterday)).toBe(true);
    expect(afterToday.apply(tomorrow)).toBe(false);
  });

  it("should check if is between(time)", function() {
    var oneDayInMilis = 86400 * 1000;
    var twoDayInMilis = 2 * 86400 * 1000;
    var today = new Date();
    var twoDaysBeforeToday = new Date(Date.now() - twoDayInMilis);
    var tomorrow = new Date(Date.now() + oneDayInMilis);
    var twoDaysAfterToday = new Date(Date.now() + twoDayInMilis);

    var betweenDates = $m.bewteen(today, twoDaysAfterToday);
    expect(betweenDates.apply(today)).toBe(true);
    expect(betweenDates.apply(tomorrow)).toBe(true);
    expect(betweenDates.apply(twoDaysAfterToday)).toBe(true);
    expect(betweenDates.apply(twoDaysBeforeToday)).toBe(false);
  });

  it("should be email string", function() {
    var validMail = "user@mailserv.er";
    var invalidEmail = "ultra user @ google.com pastor o pai";

    var isEmail = $m.email();
    expect(isEmail.apply(validMail)).toBe(true);
    expect(isEmail.apply(invalidEmail)).toBe(false);
  });

  it("should be a regex pattern", function() {

  });

  it("should be a numbered string", function() {
    var onlyNumbers = "472389472389";
    var anyNumbers = "hdjashdkas";
    var someNumbers = "hdjash534534dkas";

    var isNumber = $m.number();
    expect(isNumber.apply(onlyNumbers)).toBe(true);
    expect(isNumber.apply(someNumbers)).toBe(false);
    expect(isNumber.apply(anyNumbers)).toBe(false);
  });

  it("should be possible to create new checkers", function(){
    $m.create('odd', function(number){ return number % 2 === 1;  });

    var oddNumber = 1;
    var pairNumber = 2;
    var isOdd = $m.odd();

    expect(isOdd.apply(oddNumber)).toBe(true);
    expect(isOdd.apply(oddNumber)).toBe(false);
  });

});
