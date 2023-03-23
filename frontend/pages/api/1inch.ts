export type QuoteConfig = {
  chainId: number;
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: bigint;
};

export type SwapConfig = {
  chainId: number;
  fromTokenAddress: string;
  toTokenAddress: string;
  fromAddress: string;
  amount: bigint;
  slippage: number;
};

export class OneInch {
  baseUrl: string;

  constructor() {
    this.baseUrl = "https://api.1inch.exchange/v5.0";
  }

  async getQuote(config: QuoteConfig) {
    const url = `${this.baseUrl}/${config.chainId}/quote?fromTokenAddress=${config.fromTokenAddress}&toTokenAddress=${config.toTokenAddress}&amount=${config.amount}`;
    const result = await this.getJson(url);
    if (!result.toTokenAmount) {
      console.log(result);
      throw new Error("expected tx data");
    }

    const { toTokenAmount } = result;

    return toTokenAmount;
  }

  async getSwapTx(config: SwapConfig) {
    const url = `${this.baseUrl}/${config.chainId}/swap?fromTokenAddress=${config.fromTokenAddress}&toTokenAddress=${config.toTokenAddress}&amount=${config.amount}&fromAddress=${config.fromAddress}&slippage=${config.slippage}`;
    const result = await this.getJson(url);
    if (!result.tx) {
      console.log(result);
      throw new Error("expected tx data");
    }

    const { data, to, value } = result.tx;

    return {
      data,
      to,
      value,
    };
  }

  async getJson(url: string) {
    const res = await fetch(url);
    const json = await res.json();
    if (!json) {
      throw new Error("no response");
    }
    if (json.error) {
      console.log(json);
      throw new Error(json.description || json.error);
    }

    return json;
  }
}
