export type UsdtNetwork = "bep20" | "erc20" | "trc20";

export type UsdtPaymentMethod = {
  id: UsdtNetwork;
  label: string;
  network: string;
  address: string;
  qrImagePath: string;
};

export const USDT_PAYMENT_METHODS: UsdtPaymentMethod[] = [
  {
    id: "bep20",
    label: "USDT (BEP20)",
    network: "BNB Smart Chain (BEP20)",
    address: "0x94E41574b0b4D389c2821AD28849A4b510E3d99f",
    qrImagePath: "/usdt (BEP20).jpeg",
  },
  {
    id: "erc20",
    label: "USDT (ERC20)",
    network: "Ethereum (ERC20)",
    address: "0x94E41574b0b4D389c2821AD28849A4b510E3d99f",
    qrImagePath: "/USDT (ERC20).jpeg",
  },
  {
    id: "trc20",
    label: "USDT (TRC20)",
    network: "Tron (TRC20)",
    address: "TY9HnE3aBzNwiGmDHgDptbdjTET1mxZeec",
    qrImagePath: "/USDT (TRC20).jpeg",
  },
];

export function getUsdtPaymentMethod(id: UsdtNetwork) {
  return USDT_PAYMENT_METHODS.find((m) => m.id === id) ?? USDT_PAYMENT_METHODS[2];
}

export function formatUsdtNetworkLabel(id: UsdtNetwork) {
  return getUsdtPaymentMethod(id).label;
}
