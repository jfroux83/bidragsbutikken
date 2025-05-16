import React from "react";
import {Head, router, useForm} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";
import Form from "@/Components/Forms/Form";
import ButtonRow from "@/Components/Forms/ButtonRow";
import Submit from "@/Components/Forms/Submit";
import TextField from "@/Components/Forms/TextField";
import Textarea from "@/Components/Forms/Textarea";
import Radio from "@/Components/Forms/Radio";
import NumberField from "@/Components/Forms/NumberField";
import MultiSelectPillInput from "@/Components/Forms/MultiSelectPillInput";
import ProductVariationsManager from "@/Components/ProductVariations/ProductVariationsManager";
import {CornerDownLeft} from "lucide-react";

interface Product {
    id: number;
    name: string;
    unit_measure: string;
    tag_line: string;
    description: string;
    status: boolean;
    base_price: number;
    type: string;
    category_ids: number[];
    tag_ids: number[];
    variations: any[];
}

interface Category {
    value: number;
    label: string;
}

interface Tag {
    value: number;
    label: string;
}

interface Attribute {
    name: string;
    values: string[];
}

interface Props {
    product: Product;
    categories: Category[];
    tags: Tag[];
    attributes: Attribute[];
}

const Edit = ({
    product,
    categories,
    tags,
    attributes
}: Props) => {

    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        unit_measure: product.unit_measure,
        tag_line: product.tag_line,
        description: product.description,
        status: product.status,
        base_price: product.base_price,
        type: product.type,
        category_ids: product.category_ids,
        tag_ids: product.tag_ids,
        variations: product.variations || []
    });

    const handleReturn = () => {
        router.get('/vendor/product');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/vendor/product/${product.id}`);
    };

    const handleCategoryChange = (selectedIds: (number | string)[]) => {
        setData('category_ids', selectedIds.map(id => Number(id)));
    };

    const handleTagChange = (selectedIds: (number | string)[]) => {
        setData('tag_ids', selectedIds.map(id => Number(id)));
    };

    const handleVariationsChange = (variations: any[]) => {
        setData(prevData => ({
            ...prevData,
            variations: variations
        }));
    };

    const actionsRoot = [
        { icon: CornerDownLeft, label: 'Return to Products', onClick: handleReturn, variant: 'secondary' }
    ];

    return (
        <VendorLayout>
            <Head title="Product | Edit" />
            <PageLayout
                title="Product | Edit"
                // @ts-ignore
                actions={actionsRoot}
            >
                <Form onSubmit={handleSubmit}>
                    <TextField
                        name="name"
                        label="Product Name"
                        value={data.name}
                        onChange={(e: any) => setData('name', e.target.value)}
                        error={errors.name}
                        required
                    />

                    <TextField
                        name="unit_measure"
                        label="Unit of Measure"
                        value={data.unit_measure}
                        onChange={(e: any) => setData('unit_measure', e.target.value)}
                        error={errors.unit_measure}
                    />

                    <TextField
                        name="tag_line"
                        label="Tag Line"
                        value={data.tag_line}
                        onChange={(e: any) => setData('tag_line', e.target.value)}
                        error={errors.tag_line}
                    />

                    <Textarea
                        name="description"
                        label="Description"
                        value={data.description}
                        onChange={(field, value) => setData(field, value)}
                        error={errors.description}
                        placeholder="add product description..."
                        className=""
                        maxLength={1000}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <Radio
                            name="status"
                            label="Status"
                            value={data.status}
                            options={[
                                { value: true, label: 'Active' },
                                { value: false, label: 'Inactive' },
                            ]}
                            onChange={(field, value) => setData(field, value)}
                            error={errors.status}
                            cols={2}
                            containerHeight="80px"
                            required
                        />

                        <Radio
                            name="type"
                            label="Type"
                            value={data.type}
                            options={[
                                { value: 'both', label: 'Both' },
                                { value: 'subscription', label: 'Subscription' },
                                { value: 'once-off', label: 'Once-Off' },
                            ]}
                            onChange={(field, value) => setData(field, value)}
                            error={errors.type}
                            cols={3}
                            containerHeight="80px"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <NumberField
                            name="base_price"
                            label="Base Price"
                            value={data.base_price}
                            onChange={(value) => setData('base_price', value)}
                            error={errors.base_price}
                            required
                        />
                    </div>

                    <MultiSelectPillInput
                        label="Categories"
                        availableItems={categories}
                        selectedItems={data.category_ids}
                        onChange={handleCategoryChange}
                        placeholder="Select categories..."
                        id="product-categories"
                    />

                    <MultiSelectPillInput
                        label="Tags"
                        availableItems={tags}
                        selectedItems={data.tag_ids}
                        onChange={handleTagChange}
                        placeholder="Select tags..."
                        id="product-tags"
                    />

                    <div className="mt-8 border-t pt-8">
                        <ProductVariationsManager
                            productId={product.id}
                            onChange={handleVariationsChange}
                            initialVariations={data.variations}
                            attributes={attributes}
                        />
                    </div>

                    <ButtonRow>
                        <Submit processing={processing} />
                    </ButtonRow>
                </Form>
            </PageLayout>
        </VendorLayout>
    );
};

export default Edit;
