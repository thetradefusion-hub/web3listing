import type { Metadata } from "next";
import { ContactView } from "@/components/public/contact/contact-view";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get a free Web3 listing consultation. Reach Web3Listing on Telegram or send your project details — exchange listing, market making, marketing, and growth.",
};

export default function ContactPage() {
  return <ContactView />;
}
