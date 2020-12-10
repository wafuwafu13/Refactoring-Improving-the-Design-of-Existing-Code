declare module "*/invoices.json" {
  type Invoice = {
    customer: string;
    performances: {
      playID: "hamlet" | "as-like" | "othello";
      audience: number;
    }[];
  };

  const invoice: Invoice;
  export default invoice;
}
