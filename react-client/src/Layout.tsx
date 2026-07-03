import React from "react";
import Appbar from "./Components/Appbar";
import Sidebar from "./Components/Sidebar";
import Bottombar from "./Components/Bottombar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* <!-- App bar --> */}
      <Appbar />

      {/* <!-- Side bar for pc --> */}
      <Sidebar />

      {/* <!-- Bottom bar for mobile --> */}
      <Bottombar />

      {/* <!-- Main content goes here --> */}
      <main className="fill">
        <div
          style={{
            backgroundColor: "var(--surface)",
            borderRadius: "8px",
            padding: "8px",
          }}
        >
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
