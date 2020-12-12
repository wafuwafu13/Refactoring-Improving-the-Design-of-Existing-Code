import plays from "./plays.json";
import invoice from "./invoices.json";

type Invoice = typeof invoice;
type Plays = typeof plays;

type Performance = typeof invoice.performances[0];
type Play = Plays[Performance["playID"]];

type StatementData = {
  customer?: string;
  performances?: {
    playID: Performance["playID"];
    audience: number;
    play?: Play;
    amount?: number;
    volumeCredits?: number;
  }[];
  totalAmount?: number;
  totalVolumeCredits?: number;
};

function statement(invoice: Invoice): string {
  const statementData: StatementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return renderPlainText(statementData);

  function enrichPerformance(
    aPerformance: Required<StatementData>["performances"][0]
  ): Required<StatementData>["performances"][0] {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }

  function playFor(
    aPerformance: Required<StatementData>["performances"][0]
  ): Play {
    return plays[aPerformance!.playID];
  }

  function amountFor(
    aPerformance: Required<StatementData>["performances"][0]
  ): number {
    let result = 0;
    switch (aPerformance.play!.type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknown type: ${aPerformance.play!.type}`);
    }
    return result;
  }

  function volumeCreditsFor(
    aPerformance: Required<StatementData>["performances"][0]
  ): number {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" == aPerformance.play!.type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  function totalAmount(data: StatementData): number {
    return data.performances!.reduce(
      (total: number, p: Required<StatementData>["performances"][0]) =>
        total + p.amount!,
      0
    );
  }

  function totalVolumeCredits(data: StatementData): number {
    return data.performances!.reduce(
      (total: number, p: Required<StatementData>["performances"][0]) =>
        total + p.volumeCredits!,
      0
    );
  }
}

function renderPlainText(data: StatementData): string {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances!) {
    result += `  ${perf.play!.name}: ${usd(perf.amount!)} (${
      perf.audience
    } seats)\n`;
  }
  result += `Amount owed is ${usd(data.totalAmount!)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;

  function usd(aNumber: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumIntegerDigits: 2,
    }).format(aNumber / 100);
  }
}

console.log(statement(invoice));
