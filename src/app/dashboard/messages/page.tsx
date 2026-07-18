import { MessageSquare } from "lucide-react";
import ComingSoon from "../../../components/dashboard/ComingSoon";

export default function MessagesPage() {
  return (
    <ComingSoon
      title="الرسائل"
      description="محادثاتك مع العملاء والمحترفين في مكان واحد، مع الجسر اللغوي الفوري."
      icon={MessageSquare}
    />
  );
}
