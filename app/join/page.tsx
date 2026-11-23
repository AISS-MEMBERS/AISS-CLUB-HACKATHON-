import type { Metadata } from "next";
import SiteHeader from "@/components/nisa/SiteHeader";
import Footer from "@/components/selen/Footer";
import JoinContent from "./JoinContent";

export const metadata: Metadata = {
  title: "Join the Club | AISS Club",
  description:
    "Join AISS through Üsküdar University's app or official SKS website. A simple illustrated guide to club membership.",
};

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EC] text-[#1E2A5A]">
      <SiteHeader />
      <JoinContent />
      <Footer />
    </div>
  );
}
