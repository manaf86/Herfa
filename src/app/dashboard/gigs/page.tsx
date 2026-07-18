import { LayoutGrid } from "lucide-react";
import ComingSoon from "../../../components/dashboard/ComingSoon";

export default function MyGigsPage() {
  return (
    <ComingSoon
      title="خدماتي"
      description="أدر خدماتك المنشورة، حرّر باقاتها، وأنشئ خدمات جديدة."
      icon={LayoutGrid}
    />
  );
}
