import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const DashboardLayout = ({ children, title }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} />
        <main className="p-8 lg:p-12 flex-1 overflow-y-auto">
          <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;