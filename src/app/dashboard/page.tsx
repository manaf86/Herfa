import StatCards from "../../components/dashboard/StatCards";
import HerfaIndexCard from "../../components/dashboard/HerfaIndexCard";
import SalesFunnelCard from "../../components/dashboard/SalesFunnelCard";
import RecentOrdersCard from "../../components/dashboard/RecentOrdersCard";

export default function DashboardHome() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-6 sm:mb-8">
        <h1
          className="text-2xl font-bold sm:text-3xl"
          style={{ color: "var(--heading)" }}
        >
          لوحة القيادة
        </h1>
        <p
          className="mt-1.5 text-sm"
          style={{ color: "var(--muted)" }}
        >
          نظرة عامة على نشاطك هذا الأسبوع.
        </p>
      </header>

      <div className="space-y-6">
        <StatCards />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <HerfaIndexCard />
          <SalesFunnelCard />
        </div>

        <RecentOrdersCard />
      </div>
    </div>
  );
}
