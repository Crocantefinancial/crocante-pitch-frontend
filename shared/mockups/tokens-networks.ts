export const ETH_TOKEN_NETWORKS = [
  {
    currencyId: "ETH",
    networkId: "ETHEREUM",
    allowDeposits: true,
    allowWithdrawals: true,
    withdrawalFeeValue: "10",
    withdrawalMin: "0.05",
    depositMin: "0.1",
    currency: {
      id: "ETH",
      name: "Ethereum",
      decimals: 8,
      allowTransfers: true,
      disabled: false,
      priority: 2,
    },
    network: {
      id: "ETHEREUM",
      name: "Ethereum",
      mainCurrencyID: "ETH",
      minConfirms: 1,
    },
    withdrawalFee: "0.0033463002467896",
  },
];

export const USDT_TOKEN_NETWORKS = [
  {
    currencyId: "USDT",
    networkId: "ETHEREUM",
    allowDeposits: true,
    allowWithdrawals: true,
    withdrawalFeeValue: "5",
    withdrawalMin: "100",
    depositMin: "50",
    currency: {
      id: "USDT",
      name: "Tether",
      decimals: 2,
      allowTransfers: true,
      disabled: false,
      priority: 3,
    },
    network: {
      id: "ETHEREUM",
      name: "Ethereum",
      mainCurrencyID: "ETH",
      minConfirms: 1,
    },
    withdrawalFee: "5",
  },
  {
    currencyId: "USDT",
    networkId: "TRON",
    allowDeposits: true,
    allowWithdrawals: true,
    withdrawalFeeValue: "10",
    withdrawalMin: "100",
    depositMin: "50",
    currency: {
      id: "USDT",
      name: "Tether",
      decimals: 2,
      allowTransfers: true,
      disabled: false,
      priority: 3,
    },
    network: {
      id: "TRON",
      name: "Tron",
      mainCurrencyID: "TRX",
      minConfirms: 1,
    },
    withdrawalFee: "10",
  },
];

export const AVAX_TOKEN_NETWORKS = [
  {
    currencyId: "AVAX",
    networkId: "AVALANCHE",
    allowDeposits: true,
    allowWithdrawals: true,
    withdrawalFeeValue: "10",
    withdrawalMin: "5",
    depositMin: "5",
    currency: {
      id: "AVAX",
      name: "Avalanche",
      decimals: 8,
      allowTransfers: true,
      disabled: false,
      priority: 0,
    },
    network: {
      id: "AVALANCHE",
      name: "Avalanche",
      mainCurrencyID: "AVAX",
      minConfirms: 1,
    },
    withdrawalFee: "0.8090287609724526",
  },
];

export const BTC_TOKEN_NETWORKS = [
  {
    currencyId: "BTC",
    networkId: "BITCOIN",
    allowDeposits: true,
    allowWithdrawals: true,
    withdrawalFeeValue: "10",
    withdrawalMin: "0.002",
    depositMin: "0.005",
    currency: {
      id: "BTC",
      name: "Bitcoin",
      decimals: 8,
      allowTransfers: true,
      disabled: false,
      priority: 3,
    },
    network: {
      id: "BITCOIN",
      name: "Bitcoin",
      mainCurrencyID: "BTC",
      minConfirms: 1,
    },
    withdrawalFee: "0.0001147772890178",
  },
];
