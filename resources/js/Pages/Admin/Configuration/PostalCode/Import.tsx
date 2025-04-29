import React, {useRef, useState} from "react";
import {Head, router} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageLayout from "@/Components/UI/PageLayout";
import Form from "@/Components/Forms/Form";
import FileInput from "@/Components/Forms/FileInput";
import ButtonRow from "@/Components/Forms/ButtonRow";
import Submit from "@/Components/Forms/Submit";
import {toast} from "@/Lib/toast";
import {CornerDownLeft} from "lucide-react";

const Import = () => {

    const fileInputRef = useRef(null);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a file first")
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        router.post('/admin/configuration/postal-code/upload', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                fileInputRef.current?.reset();
                setFile(null);
                toast.success("File uploaded successfully.");
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Upload failed.');
            },
            onFinish: () => {
                setIsUploading(false);
            }
        })
    };

    const handleFileChange = (newFile: any) => {
        setFile(newFile);
    };

    const handleReturn = () => {
        router.get('/admin/configuration/postal-code');
    };

    const actionsRoot = [
        { label: 'Return', icon: CornerDownLeft, onClick: handleReturn, variant: 'secondary', size: 'sm' },
    ];

    return (
        <AdminLayout>
            <Head title="Config | Postal Codes | Import" />
            <PageLayout
                title="Configuration | Postal Codes | Import"
                containerClassName="bg-white shadow rounded-md mt-2"
                // @ts-ignore
                actions={actionsRoot}
            >
                <Form
                    classNames="w-[600px] mx-auto"
                    onSubmit={handleSubmit}
                >
                    <FileInput
                        ref={fileInputRef}
                        name="file"
                        label="Postal Codes"
                        value={file}
                        accept=".xlsx,.xls"
                        buttonLabel="Browse"
                        hint="Upload Excel file (XLSX or XLS format)"
                        onChange={handleFileChange}
                    />

                    <ButtonRow>
                        <Submit processing={isUploading} />
                    </ButtonRow>
                </Form>
            </PageLayout>
        </AdminLayout>
    );
};

export default Import;
