declare module "*/plays.json" {
  type Play = {
    hamlet: {
      name: string;
      type: string;
    };
    "as-like": {
      name: string;
      type: string;
    };
    othello: {
      name: string;
      type: string;
    };
  };

  const play: Play;
  export default play;
}
