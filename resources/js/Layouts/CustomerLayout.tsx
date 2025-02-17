import React from "react";
import ToastContainer from "@/Components/UI/ToastContainer";
import CustomerFooter from "@/Components/Footers/CustomerFooter";
import CustomerNav from "@/Components/Navs/CustomerNav";

interface Props {
    children: React.ReactNode;
}

const CustomerLayout = ({
    children
}: Props) => {

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50">
            {/*  Navigation  */}
            <CustomerNav />

            {/*  Main Content  */}
            <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
                <ToastContainer />
            </main>

            {/*  Footer  */}
            <CustomerFooter />
        </div>
    )
};

export default CustomerLayout;
