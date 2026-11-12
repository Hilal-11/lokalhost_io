import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PricingPlans } from "@/components/blocks/pricing-plans";

const PLANS = [
  { id: "year", name: "Yearly", price: "$59.99", period: "$4.99 / month", badge: "Save 50%" },
  { id: "month", name: "Monthly", price: "$9.99", period: "billed monthly" },
  { id: "life", name: "Lifetime", price: "$149", period: "one-time purchase" },
];

export default function Paywall() {
  const [plan, setPlan] = useState("year");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* usage-start */}
      <PricingPlans
        plans={PLANS}
        value={plan}
        onChange={setPlan}
        features={["Unlimited projects", "Cloud sync across devices", "All 40+ templates"]}
        onContinue={() => console.log("purchase", plan)} // call RevenueCat / StoreKit here
        onRestore={() => console.log("restore")}
      />
      {/* usage-end */}
    </SafeAreaView>
  );
}
