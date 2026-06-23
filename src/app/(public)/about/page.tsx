import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = { title: "About Us" };

const services = [
  "Exchange Listing Consulting", "CoinMarketCap & CoinGecko Support",
  "Market Making Services", "Liquidity & Token Lock Services",
  "Blockchain Explorer Updates", "Web3 Wallet Integration Support",
  "Smart Contract Audit Coordination", "Crypto PR Distribution",
  "Influencer Marketing", "Community Growth", "AI-Powered Solutions",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold">About TokenWeb3Listing</h1>
      <p className="mt-6 text-lg text-muted-foreground">
        TokenWeb3Listing.com is a Web3 consulting and execution platform helping blockchain startups,
        token projects, exchanges, NFT projects, AI projects, GameFi platforms, and Web3 businesses
        access professional growth services through a single dashboard.
      </p>
      <p className="mt-4 text-muted-foreground">
        Our team coordinates listing support, exchange onboarding assistance, market making solutions,
        community growth, wallet integrations, PR distribution, influencer campaigns, smart contract audits,
        and token ecosystem services. We simplify the entire process so founders can focus on building.
      </p>

      <h2 className="mt-12 text-2xl font-bold">Our Services</h2>
      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {services.map((s) => (
          <li key={s} className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />{s}
          </li>
        ))}
      </ul>

      <div className="mt-12 rounded-lg border border-border/40 bg-card/50 p-6">
        <h3 className="font-semibold">Important Disclaimer</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          TokenWeb3Listing.com is an independent Web3 consulting and service marketplace.
          We are not affiliated with or endorsed by any exchange, wallet, media company, audit provider,
          or third-party platform unless explicitly stated. No guarantees are provided regarding
          listing approvals, media publications, token prices, or investment returns.
        </p>
      </div>

      <div className="mt-8">
        <Button className="bg-cyan-500 text-black hover:bg-cyan-400" asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}
