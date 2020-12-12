import plays from "./plays.json";
import invoice from "./invoices.json";

type Invoice = typeof invoice;
type Plays = typeof plays;

type Performance = typeof invoice.performances[0]
type Play = Plays[Performance['playID']]

function statement(invoice: Invoice, plays: Plays): string {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumIntegerDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);
    // 注文の内訳を出力
    result += `  ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${
      perf.audience
    } seats)\n`;
    totalAmount += amountFor(perf);
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

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
  return plays[aPerformance.playID]
}

function volumeCreditsFor(perf: Performance) {
  let volumeCredits = 0;
  volumeCredits += Math.max(perf.audience - 30, 0);
  if ("comedy" == playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
  return volumeCredits;
}

console.log(statement(invoice, plays));
