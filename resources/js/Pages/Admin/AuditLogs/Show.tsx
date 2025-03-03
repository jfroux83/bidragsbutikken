import {useState} from "react";
import {CornerDownLeft, FileJson} from "lucide-react";
import {router} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageLayout from "@/Components/UI/PageLayout";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import Modal from "@/Components/UI/Modal";
import CodeView from "@/Components/UI/CodeView";

interface Log {
    event: string;
    ipAddress: string;
    createdAt: string;
    user: string;
    payload: string;
}

interface Props {
    startDate: string;
    endDate: string;
    logs: Log[];
}

const Show = ({
    startDate,
    endDate,
    logs
}) => {

    const [selectedInfo, setSelectedInfo] = useState(null);

    const handleShowInfo = (info) => {
        setSelectedInfo(info);
    };

    const columns = [
        {
            key: 'createdAt',
            title: "Created At",
            sortable: true
        },
        {
            key: 'user',
            title: "User Name",
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...',
            },
            sortable: true
        },
        {
            key: 'event',
            title: 'Event',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...',
            },
            sortable: true
        },
        {
            key: 'ipAddress',
            title: 'IP Address',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'search...',
            },
            sortable: true
        },
        {
            key: 'payload',
            title: 'Payload',
            formatter: (value: any) => {
                try {
                    // Parse the JSON string if it's not already parsed
                    const info = typeof value === 'string' ? JSON.parse(value) : value;
                    return (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleShowInfo(info);
                            }}
                            className="p-1 hover:bg-gray-100 rounded-full"
                        >
                            <FileJson className="h-5 w-5 text-green-500" />
                        </button>
                    );
                } catch (error) {
                    return 'Invalid Data';
                }
            }
        },
    ];

    const actionsRoot = [
        { label: 'Return', icon: CornerDownLeft, onClick: () => router.get('/admin/logs/audit'), variant: 'secondary' },
    ]

    return (
        <AdminLayout>
            <PageLayout
                title={`Logs | Audit | ${startDate} - ${endDate}`}
                containerClassName="bg-white shadow rounded-md mt-2"
                // @ts-ignore
                actions={actionsRoot}
            >
                <ClientDataTable
                    // @ts-ignore
                    columns={columns}
                    data={logs}
                    pageSize={10}
                />

                <Modal
                    isOpen={selectedInfo !== null}
                    onClose={() => setSelectedInfo(null)}
                    title="Logs | Audit | PayLoad"
                    size="7xl"
                >
                    <CodeView code={selectedInfo} />
                </Modal>
            </PageLayout>
        </AdminLayout>
    );
};

export default Show;
