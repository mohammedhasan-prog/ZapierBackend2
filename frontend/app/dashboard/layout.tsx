import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Spacer for the toggle button */}
        <div className="h-14 md:hidden flex-shrink-0"></div> 
        
        <div className="flex-1 overflow-y-auto">
            {children}
        </div>
      </div>
    </div>
  );
}
