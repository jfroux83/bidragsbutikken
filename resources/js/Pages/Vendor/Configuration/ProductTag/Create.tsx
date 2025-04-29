import React from "react";
import {Head, router, useForm} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";
import {CornerDownLeft} from "lucide-react";
import Form from "@/Components/Forms/Form";
import TextField from "@/Components/Forms/TextField";
import ButtonRow from "@/Components/Forms/ButtonRow";
import Submit from "@/Components/Forms/Submit";

const Create = () => {

    const { data, setData, post, processing, errors } = useForm({
        name: ''
    });

    const handleReturn = () => {
        router.get('/vendor/product/tag');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/vendor/product/tag');
    }

    const actionsRoot = [
        { icon: CornerDownLeft, label: 'Return to Product Tags', onClick: handleReturn, variant: 'secondary' }
    ];

    return (
        <VendorLayout>
            <Head title="Product Tag | Create" />
            <PageLayout
                title="Product Tag | Create"
                // @ts-ignore
                actions={actionsRoot}
            >
                <Form onSubmit={handleSubmit} classNames="w-[600px] mx-auto">
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
