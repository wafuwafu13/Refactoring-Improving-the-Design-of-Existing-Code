import plays from "./plays.json";
import {
  Invoice,
  StatementData,
  Play,
  StatementPerformance,
} from "./@types/types";

class PerformanceCalculator {
  performance: StatementPerformance;
  play: Play;
  constructor(aPerformance: StatementPerformance, aPlay: Play) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount(): number {
    let result = 0;
    switch (this.play.type) {
      case "tragedy":
        result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`unknown type: ${this.play.type}`);
    }
    return result;
  }

  get volumeCredits(): number {
    let result = 0;
    result += Math.max(this.performance.audience - 30, 0);
    if ("comedy" == this.play.type)
      result += Math.floor(this.performance.audience / 5);
    return result;
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
    const calculator = new PerformanceCalculator(
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
