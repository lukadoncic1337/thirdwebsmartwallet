# Thirdweb Smart Wallet

Chrome extension to manage your Thirdweb smart wallet outside of dApps.

If you use a dApp powered by Thirdweb's Account Factory (like [p2p.me](https://p2p.me)), your smart wallet already exists — but you can only access it from within the dApp. This extension gives you direct access to that same wallet so you can check balances, send tokens, and manage funds without needing to go through the dApp.

## What it does

- **Access your smart wallet directly** — same address, same funds, no dApp required
- **Send ETH and ERC-20 tokens** — USDC and USDT pre-configured on all mainnets
- **Multi-chain** — Ethereum, Base, Optimism, Polygon, BNB Chain
- **Encrypted local storage** — your private key is encrypted with AES-256-GCM, password never stored

## Warning

This extension is meant as an emergency tool. Use it only to transfer your funds out if the dApp goes down or becomes unavailable. Uninstall it immediately after. Do not keep it installed as a daily wallet.

## Scope

Right now the extension only supports sending native tokens (ETH, POL, BNB) and ERC-20 tokens. There are no plans to add more features.

## Questions

Have questions about how the code works? Ask the AI: [deepwiki.com/lukadoncic1337/thirdwebsmartwallet](https://deepwiki.com/lukadoncic1337/thirdwebsmartwallet)

## Install

```bash
npm install
npm run build
```

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the `dist/` folder

## Setup

1. Import the EOA private key that you use as signer in the dApp
2. Choose **p2p.me** (Base, ready to go) or **Custom setup**
3. Your smart wallet address will be the same one the dApp generated for you

## Development

```bash
npm run dev    # watch mode
npm run build  # production
```

## License

MIT
