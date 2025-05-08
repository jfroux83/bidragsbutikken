import React from "react";
import {Head, router, useForm} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";
import Form from "@/Components/Forms/Form";
import TextField from "@/Components/Forms/TextField";
import ButtonRow from "@/Components/Forms/ButtonRow";
import Submit from "@/Components/Forms/Submit";
import Radio from "@/Components/Forms/Radio";
import NumberField from "@/Components/Forms/NumberField";
import {CornerDownLeft} from "lucide-react";

interface Price {
    id: number;
    product: {
        id: number;
        name: string;
        source_vendor_id: number;
    };
    type: string;
    status: boolean;
    variation?: string;
    price: number;
}

interface Props {
    price: Price;
}

const EditPrice = ({ price }: Props) => {

    const { data, setData, put, processing, errors } = useForm({
        product: price.product.name,
        type: price.type,
        status: price.status,
        variation: price.variation,
        price: price.price,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/vendor/product/catalog/product/price/${price.id}`);
    };

    const handleReturn = () => {
        router.get(`/vendor/product/catalog/${price.product.source_vendor_id}/${price.product.id}/edit`);
    };

    const actionsRoot = [
        { icon: CornerDownLeft, label: 'Return to Product Catalog', onClick: handleReturn, variant: 'secondary' }
    ];

    return (
        <VendorLayout>
            <Head title="Product Catalog | Product | Price | Edit" />
            <PageLayout
                title={`Product Catalog | ${price.product.name} | Price | Edit`}
                // @ts-ignore
                actions={actionsRoot}
            >
                <Form
                    onSubmit={handleSubmit}
                >
                    <TextField
                        name="product"
                        label="Product"
                        value={data.product}
                        onChange={() => {}}
                        error={errors.product}
                        disabled
                    />

                    <TextField
                        name="type"
                        label="Type"
                        value={data.type}
                        onChange={() => {}}
                        error={errors.type}
                        disabled
                    />

                    <Radio
                        name="status"
                        label="Status"
                        value={data.status}
                        options={[
                            { label: 'Active', value: true },
                            { label: 'Inactive', value: false },
                        ]}
                        onChange={(field, value) => setData(field, value)}
                        error={errors.status}
                        cols={2}
                        containerHeight="80px"
                        required
                    />

                    <TextField
                        name="variation"
                        label="Variation"
                        value={data.variation}
                        onChange={() => {}}
                        error={errors.variation}
                        disabled
                    />

                    <NumberField
                        name="price"
                        label="Price"
                        value={data.price}
                        onChange={(value) => setData('price', value)}
                        error={errors.price}
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

export default EditPrice;
