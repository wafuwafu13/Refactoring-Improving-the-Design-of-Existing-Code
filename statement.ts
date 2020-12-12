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
      play?: Play
  }[];
}

function statement(invoice: Invoice) {
  const statementData: StatementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  return renderPlainText(statementData);

  function enrichPerformance(aPerformance: Required<StatementData>["performances"][0]) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result)
    return result;
  }

  function playFor(aPerformance: Required<StatementData>["performances"][0]): Play {
    return plays[aPerformance!.playID]
  }
}

function renderPlainText(data: Partial<Invoice>) {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances!) {
    result += `  ${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    } seats)\n`;
  }
  result += `Amount owed is ${usd(totalAmount())}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;

  function amountFor(aPerformance: Performance): number {
    let result = 0;
    switch (playFor(aPerformance).type) {
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
        throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }
    return result;
  }

  function playFor(aPerformance: Performance): Play {
    return plays[aPerformance.playID];
  }

  function volumeCreditsFor(aPerformance: Performance): number {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" == playFor(aPerformance).type)
      result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  function usd(aNumber: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumIntegerDigits: 2,
    }).format(aNumber / 100);
  }

  function totalVolumeCredits() {
    let result = 0;
    for (let perf of data.performances!) {
      result += volumeCreditsFor(perf);
    }
    return result;
  }

  function totalAmount() {
    let result = 0;
    for (let perf of data.performances!) {
      result += amountFor(perf);
    }
    return result;
  }
}

console.log(statement(invoice));
