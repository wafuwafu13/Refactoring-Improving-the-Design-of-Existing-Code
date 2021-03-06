import plays from "./plays.json";
import invoice from "./invoices.json";

export type Invoice = typeof invoice;
export type Plays = typeof plays;

export type Performance = typeof invoice.performances[0];
export type Play = Plays[Performance["playID"]];

export type StatementData = {
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

export type StatementPerformance = Required<StatementData>["performances"][0];

export type ProvinceData = {
  name: string;
  producers: {
    name: string;
    cost: number;
    production: number;
  }[];
  demand: number;
  price: number;
};

export type ProducerData = ProvinceData["producers"][0];
