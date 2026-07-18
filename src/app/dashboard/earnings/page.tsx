import { Wallet } from "lucide-react";
import ComingSoon from "../../../components/dashboard/ComingSoon";

export default function EarningsPage() {
  return (
    <ComingSoon
      title="الأرباح"
      description="رصيدك في الخزنة، المدفوعات المعتمدة، وسجل السحب."
      icon={Wallet}
    />
  );
}
