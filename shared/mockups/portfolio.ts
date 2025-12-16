export const PORTFOLIO_DATA = {
  totalBalance: 128500000,
  cryptocurrencies: 122770000,
  currencies: 5220000,
  commodities: 510000,
};

export const ASSET_ALLOCATION = [
  { name: "BTC", value: 66.1, color: "#3B82F6", amount: 84865850 },
  { name: "ETH", value: 27.9, color: "#A855F7", amount: 35851500 },
  { name: "Stables", value: 3.5, color: "#22C55E", amount: 4497500 },
  { name: "Fiat", value: 1.91, color: "#64748B", amount: 2454350 },
  { name: "Others", value: 0.59, color: "#F97316", amount: 758150 },
];

export const CRYPTOCURRENCIES = [
  {
    code: "BTC",
    name: "Bitcoin",
    amount: "849.5052 BTC",
    value: "$84.87M",
    change: "+2.4%",
  },
  {
    code: "ETH",
    name: "Ethereum",
    amount: "13.8k ETH",
    value: "$35.85M",
    change: "+1.8%",
  },
  {
    code: "USDC",
    name: "USD Coin",
    amount: "2.24M USDC",
    value: "$2.24M",
    change: "0%",
  },
  {
    code: "USDT",
    name: "Tether",
    amount: "2.25M USDT",
    value: "$2.25M",
    change: "0%",
  },
  {
    code: "SOL",
    name: "Solana",
    amount: "8.5k SOL",
    value: "$1.87M",
    change: "+3.2%",
  },
];

export const CURRENCIES = [
  {
    code: "BRL",
    name: "Brazilian Real",
    amount: "23.97M BRL",
    value: "$4.78M",
    change: "-0.3%",
  },
  {
    code: "USD",
    name: "US Dollar",
    amount: "444.40k USD",
    value: "$444.40k",
    change: "0%",
  },
  {
    code: "EUR",
    name: "Euro",
    amount: "6.81k EUR",
    value: "$7.39k",
    change: "+0.1%",
  },
  {
    code: "GBP",
    name: "British Pound",
    amount: "9.58k GBP",
    value: "$12.10k",
    change: "+0.2%",
  },
];

export const INTERNAL_WALLETS = [
  {
    name: "Hot Wallet - Operations",
    balance: "$1.56M",
    available: "$1.55M",
    assets: 12,
    type: "Multi-sig 3/5",
    lastActivity: "2 min ago",
  },
  {
    name: "Cold Wallet - Treasury",
    balance: "$85.2M",
    available: "$85.2M",
    assets: 8,
    type: "Hardware",
    lastActivity: "3 days ago",
  },
  {
    name: "Hot Wallet - Trading",
    balance: "$2.8M",
    available: "$2.75M",
    assets: 15,
    type: "Multi-sig 2/3",
    lastActivity: "5 min ago",
  },
];

export const EXCHANGES_DATA = [
  {
    name: "Bitgo Prime",
    balance: "$35.6M",
    available: "$35.5M",
    assets: 18,
    status: "Connected",
    lastSync: "Just now",
  },
  {
    name: "Coinbase Prime",
    balance: "$28.4M",
    available: "$28.2M",
    assets: 12,
    status: "Connected",
    lastSync: "1 min ago",
  },
  {
    name: "Kraken",
    balance: "$12.8M",
    available: "$12.7M",
    assets: 24,
    status: "Connected",
    lastSync: "2 min ago",
  },
  {
    name: "Binance",
    balance: "$8.5M",
    available: "$8.4M",
    assets: 32,
    status: "Connected",
    lastSync: "5 min ago",
  },
];

export const BANKS_DATA = [
  {
    name: "JP Morgan Chase",
    balance: "$2.5M",
    available: "$2.5M",
    currency: "USD",
    accountType: "Business Checking",
    lastSync: "1 hour ago",
  },
  {
    name: "HSBC",
    balance: "$1.8M",
    available: "$1.8M",
    currency: "USD, EUR, GBP",
    accountType: "Multi-currency",
    lastSync: "2 hours ago",
  },
  {
    name: "Banco do Brasil",
    balance: "23.97M BRL",
    available: "23.97M BRL",
    currency: "BRL",
    accountType: "Corporate",
    lastSync: "30 min ago",
  },
];

export const CUSTODIANS_DATA = [
  {
    name: "Copper.co",
    balance: "$42.5M",
    available: "$42.5M",
    assets: 6,
    service: "Custody & Settlement",
    lastSync: "Just now",
  },
  {
    name: "Fireblocks",
    balance: "$18.7M",
    available: "$18.6M",
    assets: 14,
    service: "Digital Asset Security",
    lastSync: "3 min ago",
  },
  {
    name: "Anchorage Digital",
    balance: "$9.2M",
    available: "$9.2M",
    assets: 8,
    service: "Qualified Custody",
    lastSync: "5 min ago",
  },
];

export const OTC_DESKS_DATA = [
  {
    name: "Galaxy Digital",
    balance: "$5.5M",
    available: "$5.5M",
    lastTrade: "1 hour ago",
    volume30d: "$125M",
    status: "Active",
  },
  {
    name: "Cumberland",
    balance: "$3.2M",
    available: "$3.2M",
    lastTrade: "3 hours ago",
    volume30d: "$89M",
    status: "Active",
  },
  {
    name: "Circle Trade",
    balance: "$2.8M",
    available: "$2.8M",
    lastTrade: "1 day ago",
    volume30d: "$67M",
    status: "Active",
  },
];
