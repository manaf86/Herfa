import { Package } from "lucide-react";
import ComingSoon from "../../../components/dashboard/ComingSoon";

export default function OrdersPage() {
  return (
    <ComingSoon
      title="الطلبات"
      description="ستجد هنا كل طلباتك النشطة والمكتملة، بحالتها المالية وموعد التسليم."
      icon={Package}
    />
  );
}
