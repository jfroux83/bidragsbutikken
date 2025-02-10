import React from "react";
import ToastContainer from "@/Components/UI/ToastContainer";
import Footer from "@/Components/UI/Footer";

interface Props {
    children: React.ReactNode;
}

const GuestLayout = ({ children }: Props) => {
    return (
        <div className="min-h-screen flex flex-col bg-neutral-50">
            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Logo/Branding */}
                <div className="mb-8">
                    <img
                        src="/images/related-logo.webp"
                        alt="RelatED Logo"
                        className="h-12 w-auto"
                    />
                </div>

                {children}
                <ToastContainer/>
            </main>

            {/* Footer */}
            <Footer/>
        </div>
    );
}

export default GuestLayout;
