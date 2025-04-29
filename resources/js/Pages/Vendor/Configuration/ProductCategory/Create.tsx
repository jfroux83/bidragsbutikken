import React from "react";
import {Head, router, useForm} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";
import Form from "@/Components/Forms/Form";
import TextField from "@/Components/Forms/TextField";
import {CornerDownLeft} from "lucide-react";
import ButtonRow from "@/Components/Forms/ButtonRow";
import Submit from "@/Components/Forms/Submit";

const Create = () => {

    const { data, setData, post, processing, errors } = useForm({
        name: ''
    });

    const handleReturn = () => {
        router.get('/vendor/product/category');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/vendor/product/category');
    };

    const actionsRoot = [
        { icon: CornerDownLeft, label: "Return to Product Categories", onClick: handleReturn, variant: 'secondary' },
    ];

    return (
        <VendorLayout>
            <Head title="Product Categories" />
            <PageLayout
                title="Product Category | Create"
                // @ts-ignore
                actions={actionsRoot}
            >
                <Form
                    onSubmit={handleSubmit}
                    classNames="w-[600px] mx-auto"
                >
                    <TextField
                        name="name"
                        label="Name"
                        value={data.name}
                        onChange={(e: any) => setData('name', e.target.value)}
                        error={errors.name}
                        required
                    />

                    <ButtonRow>
                        <Submit processing={processing} />
                    </ButtonRow>
                </Form>
            </PageLayout>
        </VendorLayout>
    );
};

export default Create;
