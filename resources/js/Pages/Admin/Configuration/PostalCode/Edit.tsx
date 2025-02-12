import React from "react";
import {Head, router, useForm} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageLayout from "@/Components/UI/PageLayout";
import {CornerDownLeft} from "lucide-react";
import Form from "@/Components/Forms/Form";
import TextField from "@/Components/Forms/TextField";
import Radio from "@/Components/Forms/Radio";
import ButtonRow from "@/Components/Forms/ButtonRow";
import Submit from "@/Components/Forms/Submit";

interface Props {
    postalCode: {
        id: number;
        status: boolean;
        postalCode: string;
        city: string;
        latitude: string;
        longitude: string;
    }
}

const Edit = ({
    postalCode
}: Props) => {

    const { data, setData, put, processing, errors } = useForm({
        postalCode: postalCode.postalCode,
        city: postalCode.city,
        latitude: postalCode.latitude,
        longitude: postalCode.longitude,
        status: postalCode.status,
    });

    const handleReturn = () => {
        router.get('/admin/configuration/postal-code');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/configuration/postal-code/${postalCode.id}`);
    };

    const actionsRoot = [
        { label: 'Return', icon: CornerDownLeft, onClick: handleReturn, variant: 'secondary', size: 'sm' },
    ];

    return (
        <AdminLayout>
            <Head title="Config | Postal Code" />
            <PageLayout
                title="Configuration | Postal Code | Edit"
                containerClassName="bg-white shadow rounded-md mt-2"
                // @ts-ignore
                actions={actionsRoot}
            >
                <Form
                    classNames="w-[600px] mx-auto"
                    onSubmit={handleSubmit}
                >
                    <Radio
                        name="status"
                        label="Status"
                        value={data.status}
                        options={[
                            { label: "Active", value: true },
                            { label: "Inactive", value: false },
                        ]}
                        onChange={(field, value) => setData(field, value)}
                        cols={2}
                        error={errors.status}
                        containerHeight="80px"
                        required={true}
                    />
                    <TextField
                        name="postalCode"
                        label="Postal Code"
                        value={data.postalCode}
                        onChange={(e: any) => setData('postalCode', e.target.value)}
                        error={errors.postalCode}
                        required={true}
                    />
                    <TextField
                        name="city"
                        label="City"
                        value={data.city}
                        onChange={(e: any) => setData('city', e.target.value)}
                        error={errors.city}
                        required={true}
                    />
                    <TextField
                        name="latitude"
                        label="Latitude"
                        value={data.latitude}
                        onChange={(e: any) => setData('latitude', e.target.value)}
                        error={errors.latitude}
                    />
                    <TextField
                        name="longitude"
                        label="longitude"
                        value={data.longitude}
                        onChange={(e: any) => setData('longitude', e.target.value)}
                        error={errors.longitude}
                    />

                    <ButtonRow>
                        <Submit processing={processing} />
                    </ButtonRow>
                </Form>
            </PageLayout>
        </AdminLayout>
    );
};

export default Edit;
