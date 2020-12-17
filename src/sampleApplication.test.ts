import { Province, sampleProvinceData } from "./sampleApplication";

describe("province", function () {
  let asia: Province;
  beforeEach(function () {
    asia = new Province(sampleProvinceData());
  });
  it("shortfall", function () {
    expect(asia.shortfall).toBe(5);
  });
  it("profit", function () {
    expect(asia.profit).toBe(230);
  });
  it("change production", function () {
    asia.producers[0].production = 20;
    expect(asia.shortfall).toBe(-6);
    expect(asia.profit).toBe(292);
  });
});
