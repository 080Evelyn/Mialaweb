// import { useRef, useState } from "react";
// import ScrollToTop from "./scrollToTop";
// import AdminSidebar from "./sidebar";
// import AdminHeader from "./header";
// import { useLocation } from "react-router";

// const Layout = ({ children, rightSidebar }) => {
//   const [openSidebar, setOpenSidebar] = useState(false);
//   const mainRef = useRef(null);
//   const location = useLocation();
//   const dash = location.pathname === "/overview";
//   const fee = location.pathname === "/proposedFee";

//   return (
//     <div className="flex h-screen w-full overflow-x-hidden">
//       <AdminSidebar open={openSidebar} setOpen={setOpenSidebar} />
//       <div className="flex-1 flex flex-col lg:ml-53">
//         <AdminHeader setOpen={setOpenSidebar} rightSidebar={rightSidebar} />
//         <ScrollToTop scrollRef={mainRef} />
//         <main
//           ref={mainRef}
//           className="flex-1 overflow-auto md:overflow-x-scroll p-4 md:p-6">
//           {children}
//         </main>
//       </div>
//       {rightSidebar && (
//         <aside
//           className={`hidden lg:flex flex-col  border-l bg-background p-4 ${
//             dash ? "!w-[22%]" : fee ? "!w-[30%]" : "!w-[20%]"
//           }  overflow-auto `}>
//           {rightSidebar}
//         </aside>
//       )}
//     </div>
//   );
// };
// export default Layout;

import { useEffect, useRef, useState } from "react";
import ScrollToTop from "./scrollToTop";
import AdminSidebar from "./sidebar";
import AdminHeader from "./header";
import { useLocation } from "react-router";

const Layout = ({ children, rightSidebar }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [showRight, setShowRight] = useState(true); // controls collapsible panel
  const mainRef = useRef(null);
  const location = useLocation();
  const dash = location.pathname === "/overview";
  const fee = location.pathname === "/proposedFee";

  useEffect(() => {
    if (!fee) setShowRight(true);
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full overflow-x-hidden relative">
      <AdminSidebar open={openSidebar} setOpen={setOpenSidebar} />

      <div className="flex-1 flex flex-col lg:ml-53">
        <AdminHeader
          setOpen={setOpenSidebar}
          rightSidebar={rightSidebar}
          toggleRightSidebar={
            fee ? () => setShowRight((prev) => !prev) : undefined
          } // toggle only for /proposedFee
        />
        <ScrollToTop scrollRef={mainRef} />
        <main
          ref={mainRef}
          className="flex-1 overflow-auto md:overflow-x-scroll p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Collapsible Right Sidebar */}
      {rightSidebar && (
        <aside
          className={`hidden lg:flex flex-col border-l bg-background p-4 transition-all duration-500 ease-in-out ${
            dash
              ? "!w-[22%]"
              : fee
              ? showRight
                ? "!w-[20%]"
                : "!w-0"
              : "!w-[20%]"
          } overflow-auto ${
            showRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}>
          {rightSidebar}
        </aside>
      )}
    </div>
  );
};

export default Layout;
