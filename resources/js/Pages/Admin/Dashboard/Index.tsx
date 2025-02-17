import {Head} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageLayout from "@/Components/UI/PageLayout";

interface Props {
    locale: {
        admin_dashboard: string;
        admin_dashboard_welcome: string;
    };
}

const Index = ({
    locale
}: Props) => {

    return (
        <AdminLayout>
            <Head title={locale.admin_dashboard} />
            <PageLayout
                title={locale.admin_dashboard}
                containerClassName="bg-white shadow rounded-md mt-2"
            >
                <div>{locale.admin_dashboard_welcome}</div>
            </PageLayout>
        </AdminLayout>
    )
};

export default Index;
