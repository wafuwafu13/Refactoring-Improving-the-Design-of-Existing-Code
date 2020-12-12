import invoice from "./invoices.json";
import createStatementData from "./createStatementData";
import { Invoice, StatementData } from "./@types/types";

function statement(invoice: Invoice): string {
  return renderPlainText(createStatementData(invoice));
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
}

function htmlStatement(invoice: Invoice) {
  return renderHtml(createStatementData(invoice));
}

function renderHtml(data: StatementData) {
  let result = `<h1>Statement for ${data.customer}</h1>\n`;
  result += "<table>\n";
  result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
  for (let perf of data.performances!) {
    result += ` <tr><td>${perf.play!.name}</td><td>${perf.audience}</td>`;
    result += `<td>${usd(perf.amount!)}</td></tr>\n`;
  }
  result += "</table>\n";
  result += `<p>Amount owed is <em>${usd(data.totalAmount!)}</em></p>\n`;
  return result;
}

function usd(aNumber: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumIntegerDigits: 2,
  }).format(aNumber / 100);
}

console.log(statement(invoice));
console.log(htmlStatement(invoice));
