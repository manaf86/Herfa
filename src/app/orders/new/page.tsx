import { Suspense } from "react";
import NewOrderView from "./NewOrderView";

// خادم: يغلّف العرض بـ Suspense حتى يعمل useSearchParams في البناء الثابت.
export default function NewOrderPage() {
  return (
    <Suspense fallback={null}>
      <NewOrderView />
    </Suspense>
  );
}
