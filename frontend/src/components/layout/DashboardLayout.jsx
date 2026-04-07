import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const DashboardLayout = ({ children, title }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="p-4 md:p-8 lg:p-12 flex-1 overflow-y-auto w-full max-w-[100vw]">
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