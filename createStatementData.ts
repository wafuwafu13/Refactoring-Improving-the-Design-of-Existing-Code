import plays from "./plays.json";
import {
  Invoice,
  StatementData,
  Play,
  StatementPerformance,
} from "./@types/types";

function createPerformanceCalculator(
  aPerformance: StatementPerformance,
  aPlay: Play
) {
  switch (aPlay.type) {
    case "tragedy":
      return new TragedyCalculator(aPerformance, aPlay);
    case "comedy":
      return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`未知の演劇の種類: ${aPlay.type}`);
  }
}

class PerformanceCalculator {
  performance: StatementPerformance;
  play: Play;
  constructor(aPerformance: StatementPerformance, aPlay: Play) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount(): number {
    throw new Error("サブクラスの責務");
  }

  get volumeCredits(): number {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

export default function createStatementData(invoice: Invoice): StatementData {
  const statementData: StatementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;

  function enrichPerformance(
    aPerformance: StatementPerformance
  ): StatementPerformance {
    const calculator = createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );
    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }

  function playFor(aPerformance: StatementPerformance): Play {
    return plays[aPerformance!.playID];
  }

  function totalAmount(data: StatementData): number {
    return data.performances!.reduce(
      (total: number, p: StatementPerformance) => total + p.amount!,
      0
    );
  }

  function totalVolumeCredits(data: StatementData): number {
    return data.performances!.reduce(
      (total: number, p: StatementPerformance) => total + p.volumeCredits!,
      0
    );
  }
}
