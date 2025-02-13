import React, {useEffect, useState} from "react";
import {Head, router} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageLayout from "@/Components/UI/PageLayout";
import Card from "@/Components/Card/Card";
import CardHeader from "@/Components/Card/CardHeader";
import CardTitle from "@/Components/Card/CardTitle";
import CardContent from "@/Components/Card/CardContent";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import CodeView from "@/Components/UI/CodeView";
import {Ban, FileJson, MessageCircle, X} from "lucide-react";
import StatusBadge from "@/Pages/Admin/SystemJobs/StatusBadge";
import Modal from "@/Components/UI/Modal";

interface Job {
    id: number;
    name: string;
    type: string;
    status: string;
    parameters: string;
    message: string;
    error: string;
    progress: number;
    started_at: string | null;
    completed_at: string | null;
    created_by: string | null;
}

interface Props {
    jobs: Job[];
    activeCount: number;
}

const POLLING_INTERVAL = 3000;

const Index = ({
    jobs: initialJobs,
    activeCount: initialActiveCount
}: Props) => {

    const [jobs, setJobs] = useState(initialJobs);
    const [activeCount, setActiveCount] = useState(initialActiveCount);
    const [message, setMessage] = useState(null);
    const [parameters, setParameters] = useState(null);
    const [errors, setErrors] = useState(null);

    const columns = [
        {
            key: "name",
            title: "Name",
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'Search name...'
            },
            sortable: true
        },
        {
            key: 'type',
            title: 'Type',
            filterable: true,
            filterConfig: {
                type: 'text',
                placeholder: 'Search type...'
            },
            sortable: true
        },
        {
            key: 'status',
            title: 'Status',
            filterable: true,
            filterConfig: {
                type: 'select',
                options: [
                    { label: 'Pending', value: 'pending' },
                    { label: 'Processing', value: 'processing' },
                    { label: 'Failed', value: 'failed' },
                    { label: 'Completed', value: 'completed' }
                ]
            },
            sortable: true,
            formatter: (value: string) => {
                if (value === 'pending') {
                    return (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex border bg-yellow-100 text-yellow-800 border-yellow-200">
                            {value}
                        </span>
                   );
                } else if (value === 'processing') {
                    return (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex border bg-blue-100 text-blue-800 border-blue-200">
                            {value}
                        </span>
                    );
                } else if (value === 'failed') {
                    return (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex border bg-red-100 text-red-800 border-red-200">
                            {value}
                        </span>
                    );
                } else if (value === 'completed') {
                    return (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex border bg-green-100 text-green-800 border-green-200">
                            {value}
                        </span>
                    );
                }
            }
        },
        {
            key: 'progress',
            title: 'Progress',
            formatter: (value: number) => `${value}%`
        },
        {
            key: 'created_at',
            title: 'Created At'
        },
        {
            key: 'completed_at',
            title: 'Completed At'
        },
        {
            key: 'created_by',
            title: 'Created By'
        },
    ];

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('/admin/system-jobs/list')
                const data = await response.json()
                setJobs(data.jobs)
                setActiveCount(data.activeCount)
            } catch (error) {
                console.error('Failed to fetch jobs:', error)
            }
        }

        const interval = window.setInterval(fetchJobs, POLLING_INTERVAL)

        return () => window.clearInterval(interval)
    }, [])

    const handleShowMessage = (row: Job) => {
        setMessage(row.message);
    };

    const handleShowParameters = (row: Job) => {
        setParameters(row.parameters);
    };

    const handleShowErrors = (row: Job) => {
        setErrors(row.error)
    };

    const handleCancel = (e: any) => {
        router.get(`/system-jobs/${e.target.dataset.id}`);
    }

    const actions = [
        { icon: MessageCircle, label: 'Show Message', onClick: handleShowMessage, variant: 'secondary' },
        { icon: FileJson, label: 'Show Parameters', onClick: handleShowParameters, variant: 'secondary' },
        { icon: Ban, label: 'Show Errors', onClick: handleShowErrors, variant: 'danger' }
    ];

    return (
        <AdminLayout>
            <Head title="System Jobs" />
            <PageLayout
                title="System Jobs"
                description="Monitor and manage system jobs"
                fullWidth={true}
            >
                {/* Active Jobs Section */}
                {activeCount > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-3">Active Jobs</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {jobs.filter(job => ['pending', 'processing'].includes(job.status))
                                .map(job => (
                                    <Card key={job.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-sm font-medium">
                                                    {job.name}
                                                </CardTitle>
                                                <StatusBadge status={job.status} />
                                                <span>
                                                    <X
                                                        className="h-4 w-4"
                                                        data-id={job.id}
                                                        onClick={handleCancel}
                                                    />
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Progress bar */}
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-blue-600 h-2.5 rounded-full"
                                                    style={{ width: `${job.progress}%` }}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">
                                                {job.message}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </div>
                )}

                {/* Jobs History */}
                <Card>
                    <CardHeader>
                        <CardTitle>Job History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ClientDataTable
                            // @ts-ignore
                            columns={columns}
                            data={jobs}
                            // @ts-ignore
                            actions={actions}
                            pageSize={10}
                        />
                    </CardContent>
                </Card>

                <Modal
                    isOpen={message !== null}
                    onClose={() => setMessage(null)}
                    title="System Jobs | Message"
                    size="7xl"
                >
                    <CodeView code={message} />
                </Modal>

                <Modal
                    isOpen={parameters !== null}
                    onClose={() => setParameters(null)}
                    title="System Jobs | Parameters"
                    size="7xl"
                >
                    <CodeView code={parameters} />
                </Modal>

                <Modal
                    isOpen={errors !== null}
                    onClose={() => setErrors(null)}
                    title="System Jobs | Errors"
                    size="7xl"
                >
                    <CodeView code={errors} />
                </Modal>
            </PageLayout>
        </AdminLayout>
    );
};

export default Index;
