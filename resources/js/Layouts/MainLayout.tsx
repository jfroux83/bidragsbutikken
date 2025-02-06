import React from "react";
import MainNav from "@/Components/Navs/MainNav";
import ToastContainer from "@/Components/UI/ToastContainer";
import Footer from "@/Components/UI/Footer";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50">
            {/* Navigation */}
            <MainNav />

            {/* Main Content */}
            <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
                <ToastContainer/>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default MainLayout;
