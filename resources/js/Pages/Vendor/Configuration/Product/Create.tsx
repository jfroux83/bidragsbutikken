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
import {CornerDownLeft} from "lucide-react";
import {Variation} from "@/Components/Product/types";
import ProductVariationsManager from "@/Components/ProductVariations/ProductVariationsManager";

interface Category {
    value: number;
    label: string;
}

interface Tag {
    value: number;
    label: string;
}

interface Props {
    categories: Category[];
    tags: Tag[]
}

const Create = ({
    categories,
    tags
}: Props) => {

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        status: true,
        base_price: 0,
        is_subscribable: false,
        category_ids: [],
        tag_ids: [],
        variations: [],
    });

    const handleReturn = () => {
        router.get('/vendor/product');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/vendor/product');
    };

    const handleCategoryChange = (selectedIds: (number | string)[]) => {
        setData('category_ids', selectedIds.map(id => Number(id)));
    };

    const handleTagChange = (selectedIds: (number | string)[]) => {
        setData('tag_ids', selectedIds.map(id => Number(id)));
    };

    const handleVariationsChange = (variations: any[]) => {
        setData('variations', variations);
    };

    const actionsRoot = [
        { icon: CornerDownLeft, label: 'Return to Products', onClick: handleReturn, variant: 'secondary' }
    ];

    // Define which attributes your variations will have (for this product type)
    const variationAttributeNames = ['Size']; // Example: Just Size
    // const variationAttributeNames = ['Size', 'Color']; // Example: Size and Color

    return (
        <VendorLayout>
            <Head title="Product | Create" />
            <PageLayout
                title="Product | Create"
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
                            name="is_subscribable"
                            label="Subscribable"
                            value={data.is_subscribable}
                            options={[
                                { value: true, label: 'Yes' },
                                { value: false, label: 'No' },
                            ]}
                            onChange={(field, value) => setData(field, value)}
                            error={errors.is_subscribable}
                            cols={2}
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

                    {/*<ProductVariationsManager*/}
                    {/*    initialVariations={data.variations}*/}
                    {/*    onChange={handleVariationsChange}*/}
                    {/*    attributeNames={variationAttributeNames}*/}
                    {/*    basePrice={data.base_price}*/}
                    {/*    errors={errors}*/}
                    {/*    disabled={processing}*/}
                    {/*/>*/}

                    <div className="mt-8 border-t pt-8">
                        <ProductVariationsManager
                            onChange={handleVariationsChange}
                            initialVariations={data.variations}
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

export default Create;
