import { ProvinceData, ProducerData } from "./@types/types";

class Province {
  _name: string;
  _producers: Array<ProducerData>;
  _totalProduction: number;
  _demand: number;
  _price: number;
  constructor(doc: ProvinceData) {
    this._name = doc.name;
    this._producers = [];
    this._totalProduction = 0;
    this._demand = doc.demand;
    this._price = doc.price;
    doc.producers.forEach((d: ProducerData) =>
      this.addProducer(new Producer(this, d))
    );
  }
  addProducer(arg: Producer): void {
    this._producers.push(arg);
    this._totalProduction += arg.production;
  }
  get name(): string {
    return this._name;
  }
  get producers(): ProvinceData["producers"] {
    return this._producers.slice();
  }
  get totalProduction(): number {
    return this._totalProduction;
  }
  set totalProduction(arg: number) {
    this._totalProduction = arg;
  }
  get demand(): number {
    return this._demand;
  }
  set demand(arg: number) {
    this._demand = typeof arg === "string" ? parseInt(arg) : arg;
  }
  get price(): number {
    return this._price;
  }
  set price(arg: number) {
    this._price = typeof arg === "string" ? parseInt(arg) : arg;
  }

  get shortfall(): number {
    return this._demand - this.totalProduction;
  }

  get profit(): number {
    return this.demandValue! - this.demandCost;
  }
  get demandCost(): number {
    let remainingDemand = this.demand;
    let result = 0;
    this.producers
      .sort((a, b) => a.cost - b.cost)
      .forEach((p) => {
        if (typeof remainingDemand === "string") return;

        const contribution = Math.min(remainingDemand, p.production);
        remainingDemand -= contribution;
        result += contribution * p.cost;
      });
    return result;
  }
  get demandValue(): number | undefined {
    if (typeof this.price === "string") return;
    return this.satisfiedDemand * this.price;
  }
  get satisfiedDemand(): number {
    return Math.min(this._demand, this.totalProduction);
  }
}

class Producer {
  _province: {
    name: string;
    producers: Array<ProducerData>;
    totalProduction: number;
    demand: number;
    price: number;
  };
  _cost: number;
  _name: string;
  _production: number;
  constructor(aProvince: Province, data: ProducerData) {
    this._province = aProvince;
    this._cost = data.cost;
    this._name = data.name;
    this._production = data.production || 0;
  }
  get name(): string {
    return this._name;
  }
  get cost(): number {
    return this._cost;
  }
  set cost(arg: number) {
    this._cost = typeof arg === "string" ? parseInt(arg) : arg;
  }
  get production(): number {
    return this._production;
  }
  set production(amountStr: number) {
    const amount =
      typeof amountStr === "string" ? parseInt(amountStr) : amountStr;
    const newProduction = Number.isNaN(amount) ? 0 : amount;
    this._province.totalProduction += newProduction - this._production;
    this._production = newProduction;
  }
}

function sampleProvinceData(): ProvinceData {
  return {
    name: "Asia",
    producers: [
      { name: "Byzantium", cost: 10, production: 9 },
      { name: "Attalia", cost: 12, production: 10 },
      { name: "Sinope", cost: 10, production: 6 },
    ],
    demand: 30,
    price: 20,
  };
}
