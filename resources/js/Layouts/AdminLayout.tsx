import React from "react";
import ToastContainer from "@/Components/UI/ToastContainer";
import AdminFooter from "@/Components/Footers/AdminFooter";
import AdminNav from "@/Components/Navs/AdminNav";

interface Props {
    children: React.ReactNode;
}

const AdminLayout = ({
    children
}: Props) => {

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50">
            {/*  Navigation  */}
            <AdminNav />

            {/*  Main Content  */}
            <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
                <ToastContainer />
            </main>

            {/*  Footer  */}
            <AdminFooter />
        </div>
    )
};

export default AdminLayout;
