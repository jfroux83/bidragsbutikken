import {Head, router, useForm} from "@inertiajs/react";
import VendorLayout from "@/Layouts/VendorLayout";
import PageLayout from "@/Components/UI/PageLayout";
import Form from "@/Components/Forms/Form";
import ButtonRow from "@/Components/Forms/ButtonRow";
import Submit from "@/Components/Forms/Submit";
import {CornerDownLeft} from "lucide-react";
import TextField from "@/Components/Forms/TextField";
import Textarea from "@/Components/Forms/Textarea";
import Radio from "@/Components/Forms/Radio";
import NumberField from "@/Components/Forms/NumberField";

const Create = () => {

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        status: true,
        base_price: 0,
        is_subscribable: false
    });

    const handleReturn = () => {
        router.get('/vendor/product');
    };

    const handleSubmit = () => {};

    const actionsRoot = [
        { icon: CornerDownLeft, label: 'Return to Products', onClick: handleReturn, variant: 'secondary' }
    ];

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

                    <ButtonRow>
                        <Submit processing={processing} />
                    </ButtonRow>
                </Form>
            </PageLayout>
        </VendorLayout>
    );
};

export default Create;
