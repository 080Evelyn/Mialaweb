import { useState } from "react";
import AdminSidebar from "./sidebar";
import AdminHeader from "./header";

export default function Layout({ children, rightSidebar }) {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-x-hidden">
      <AdminSidebar open={openSidebar} setOpen={setOpenSidebar} />

      <div className="flex-1 flex flex-col lg:ml-53">
        <AdminHeader setOpen={setOpenSidebar} rightSidebar={rightSidebar} />

        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>

      {rightSidebar && (
        <aside className="hidden lg:flex flex-col w-64 border-l bg-background p-4 overflow-auto">
          {rightSidebar}
        </aside>
      )}
    </div>
  );
}
