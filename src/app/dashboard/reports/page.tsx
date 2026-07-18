import { BarChart3 } from "lucide-react";
import ComingSoon from "../../../components/dashboard/ComingSoon";

export default function ReportsPage() {
  return (
    <ComingSoon
      title="التقارير"
      description="أداء خدماتك، نمو مؤشر حِرفة، وقمع مبيعاتك بتفصيل شهري."
      icon={BarChart3}
    />
  );
}
