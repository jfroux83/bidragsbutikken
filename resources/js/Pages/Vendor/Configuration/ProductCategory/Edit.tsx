import React from "react";
import {Head, router, useForm} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";
import Form from "@/Components/Forms/Form";
import TextField from "@/Components/Forms/TextField";
import ButtonRow from "@/Components/Forms/ButtonRow";
import Submit from "@/Components/Forms/Submit";
import {CornerDownLeft} from "lucide-react";

interface Props {
    category: {
        id: number;
        name: string;
    }
}

const Edit = ({
    category
}: Props) => {

    const { data, setData, put, processing, errors } = useForm({
        name: category.name
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/vendor/product/category/${category.id}`);
    };

    const handleReturn = () => {
        router.get('/vendor/product/category');
    };

    const actionsRoot = [
        { icon: CornerDownLeft, label: "Return to Product Categories", onClick: handleReturn, variant: 'secondary' },
    ];

    return (
        <VendorLayout>
            <Head title="Product Category | Edit" />
            <PageLayout
                title="Product Category | Edit"
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

export default Edit;
