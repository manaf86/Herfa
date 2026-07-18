import { Settings } from "lucide-react";
import ComingSoon from "../../../components/dashboard/ComingSoon";

export default function SettingsPage() {
  return (
    <ComingSoon
      title="الإعدادات"
      description="حسابك، إعدادات الإشعارات، وسائل الدفع، والخصوصية."
      icon={Settings}
    />
  );
}
