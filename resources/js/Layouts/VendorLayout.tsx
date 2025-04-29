import React from "react";
import ToastContainer from "@/Components/UI/ToastContainer";
import VendorFooter from "@/Components/Footers/VendorFooter";
import VendorNav from "@/Components/Navs/VendorNav";

interface Props {
    children: React.ReactNode;
}

const VendorLayout = ({
    children
}: Props) => {

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50">
            {/*  Navigation  */}
            <VendorNav />

            {/*  Main Content  */}
            <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
                <ToastContainer />
            </main>

            {/*  Footer  */}
            <VendorFooter />
        </div>
    )
};

export default VendorLayout;
