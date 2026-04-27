import { AdminSidebar } from "./_components/AdminSidebar";
import { AdminToastProvider } from "./_components/AdminToastProvider";
import { adminFr } from "@/lib/i18n/admin-fr";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminToastProvider>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Desktop top bar */}
          <header className="hidden md:flex items-center px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-20">
            <h1 className="text-sm font-semibold text-gray-900">{adminFr.title}</h1>
          </header>

          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AdminToastProvider>
  );
}
