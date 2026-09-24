import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import Sidebar from "@/components/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar user={user} />
      <div className="flex-1 min-w-0 px-5 py-8 md:px-12 md:py-10 pb-24 md:pb-10">{children}</div>
    </div>
  );
}
