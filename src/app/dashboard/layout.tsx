import type { Metadata } from "next";
import Sidebar from "../../components/dashboard/Sidebar";

export const metadata: Metadata = {
  title: "لوحة القيادة — حِرفة",
  description: "إدارة طلباتك، مساحة عملك، وأرباحك على حِرفة.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Sidebar>{children}</Sidebar>;
}
