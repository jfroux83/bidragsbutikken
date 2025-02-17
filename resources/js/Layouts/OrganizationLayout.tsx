import React from "react";
import ToastContainer from "@/Components/UI/ToastContainer";
import OrganizationFooter from "@/Components/Footers/OrganizationFooter";
import OrganizationNav from "@/Components/Navs/OrganizationNav";

interface Props {
    children: React.ReactNode;
}

const OrganizationLayout = ({
    children
}: Props) => {

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50">
            {/*  Navigation  */}
            <OrganizationNav />

            {/*  Main Content  */}
            <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
                <ToastContainer />
            </main>

            {/*  Footer  */}
            <OrganizationFooter />
        </div>
    )
};

export default OrganizationLayout;
