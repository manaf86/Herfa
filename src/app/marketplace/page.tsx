import { Suspense } from "react";
import MarketplaceView from "./MarketplaceView";

// خادم: يغلّف العرض بـ Suspense حتى يُقبل useSearchParams في البناء الثابت.
export default function MarketplacePage() {
  return (
    <Suspense fallback={null}>
      <MarketplaceView />
    </Suspense>
  );
}
