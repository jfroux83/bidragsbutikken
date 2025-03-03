import React from "react";
import {useForm} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PageLayout from "@/Components/UI/PageLayout";
import Form from "@/Components/Forms/Form";
import DatePicker from "@/Components/Forms/DatePicker";
import ButtonRow from "@/Components/Forms/ButtonRow";
import Submit from "@/Components/Forms/Submit";

interface Props {
    startDate: string,
    endDate: string,
}

const Index = ({
    startDate,
    endDate
}: Props) => {
    const { data, setData, post, processing, errors } = useForm({
        startDate: startDate,
        endDate: endDate
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/logs/audit');
    }

    return (
        <AdminLayout>
            <PageLayout
                title="Logs | Audit"
                containerClassName="bg-white shadow rounded-md mt-2"
            >
                <Form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <DatePicker
                            name="startDate"
                            label="Start Date"
                            value={data.startDate}
                            // @ts-ignore
                            onChange={(name, value) => setData(name, value)}
                            classNames="my-3"
                            format="d-m-Y"
                            separator='/'
                            error={errors.startDate}
                        />

                        <DatePicker
                            name="endDate"
                            label="End Date"
                            value={data.endDate}
                            // @ts-ignore
                            onChange={(name, value) => setData(name, value)}
                            classNames="my-3"
                            format="d-m-Y"
                            separator="/"
                            error={errors.endDate}
                        />
                    </div>

                    <ButtonRow>
                        <Submit processing={processing} />
                    </ButtonRow>
                </Form>
            </PageLayout>
        </AdminLayout>
    );
};

export default Index;
