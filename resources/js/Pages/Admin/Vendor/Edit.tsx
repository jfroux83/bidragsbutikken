import {useForm} from "@inertiajs/react";
import React from "react";
import Radio from "@/Components/Forms/Radio";
import TextField from "@/Components/Forms/TextField";
import Select from "@/Components/Forms/Select";
import {Mail} from "lucide-react";
import NumberField from "@/Components/Forms/NumberField";
import ButtonRow from "@/Components/Forms/ButtonRow";
import Submit from "@/Components/Forms/Submit";
import Form from "@/Components/Forms/Form";

interface Props {
    vendor: {
        id: number;
        status: boolean;
        name: string;
        address1: string;
        address2: string;
        city: string;
        postalCode: string;
        telephone: string;
        email: string;
        receiveOrdersEmail: boolean;
        freeShippingAmount: number;
        adminFee: number;
        paymentFee: number;
        systemFee: number;
        contributionFee: number;
        bonusFee: number;
        maxDeliveryDistance: number;
    };
    postalCodes: Array<{
        label: string;
        value: string;
    }>;
}

const Edit = ({
    vendor,
    postalCodes,
}: Props) => {

    const { data, setData, put, processing, errors } = useForm({
        status: vendor.status,
        name: vendor.name,
        address1: vendor.address1,
        address2: vendor.address2,
        city: vendor.city,
        postalCode: vendor.postalCode,
        telephone: vendor.telephone,
        email: vendor.email,
        receiveOrdersEmail: vendor.receiveOrdersEmail,
        freeShippingAmount: vendor.freeShippingAmount,
        adminFee: vendor.adminFee,
        paymentFee: vendor.paymentFee,
        systemFee: vendor.systemFee,
        contributionFee: vendor.contributionFee,
        bonusFee: vendor.bonusFee,
        maxDeliveryDistance: vendor.maxDeliveryDistance,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/vendor/${vendor.id}`);
    };

    return (
        <Form onSubmit={handleSubmit}>
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
                name="name"
                label="Name"
                value={data.name}
                onChange={(e: any) => setData('name', e.target.value)}
                error={errors.name}
                required={true}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                    name="address1"
                    label="Address 1"
                    value={data.address1}
                    onChange={(e: any) => setData('address1', e.target.value)}
                    error={errors.address1}
                />

                <TextField
                    name="address2"
                    label="Address 2"
                    value={data.address2}
                    onChange={(e: any) => setData('address2', e.target.value)}
                    error={errors.address2}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                    name="city"
                    label="City"
                    value={data.city}
                    onChange={(e: any) => setData('city', e.target.value)}
                    error={errors.city}
                    disabled={true}
                />

                <Select
                    name="postalCode"
                    label="Postal Code"
                    value={data.postalCode}
                    options={postalCodes}
                    onChange={(field, value) => {
                        setData(field, value)

                        const foundObj = postalCodes.find(p => p.value === value);

                        if (foundObj) {
                            const city = foundObj.label.split(',')[1].trim();
                            setData('city', city);
                        }
                    }}
                    error={errors.postalCode}
                    placeholder="Please select"
                    searchable={true}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                    name="telephone"
                    label="Telephone"
                    value={data.telephone}
                    onChange={(e: any) => setData('telephone', e.target.value)}
                    error={errors.telephone}
                    prefix="+47"
                />

                <TextField
                    name="email"
                    label="Email"
                    value={data.email}
                    onChange={(e: any) => setData('email', e.target.value)}
                    error={errors.email}
                    suffix={<Mail />}
                    required={true}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberField
                    name="adminFee"
                    label="Admin Fee"
                    value={data.adminFee}
                    onChange={(value: number) => setData('adminFee', value)}
                    error={errors.adminFee}
                    required
                />

                <NumberField
                    name="paymentFee"
                    label="Payment Fee"
                    value={data.paymentFee}
                    onChange={(value: number) => setData('paymentFee', value)}
                    error={errors.paymentFee}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberField
                    name="systemFee"
                    label="System Fee"
                    value={data.systemFee}
                    onChange={(value: number) => setData('systemFee', value)}
                    error={errors.systemFee}
                    required
                />

                <NumberField
                    name="contributionFee"
                    label="Contribution Fee"
                    value={data.contributionFee}
                    onChange={(value: number) => setData('contributionFee', value)}
                    error={errors.contributionFee}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberField
                    name="bonusFee"
                    label="Bonus Fee"
                    value={data.bonusFee}
                    onChange={(value: number) => setData('bonusFee', value)}
                    error={errors.bonusFee}
                    required
                />

                <NumberField
                    name="freeShippingAmount"
                    label="Free Shipping Amount"
                    value={data.freeShippingAmount}
                    onChange={(value: number) => setData('freeShippingAmount', value)}
                    error={errors.freeShippingAmount}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Radio
                    name="receiveOrdersEmail"
                    label="Receive Orders per Email"
                    value={data.receiveOrdersEmail}
                    options={[
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                    ]}
                    onChange={(field, value) => setData(field, value)}
                    cols={2}
                    error={errors.receiveOrdersEmail}
                    containerHeight="80px"
                    required
                />

                <NumberField
                    name="maxDeliveryDistance"
                    label="Max Delivery Distance"
                    value={data.maxDeliveryDistance}
                    onChange={(value: number) => setData('maxDeliveryDistance', value)}
                    error={errors.maxDeliveryDistance}
                    required
                />
            </div>

            <ButtonRow>
                <Submit processing={processing} />
            </ButtonRow>
        </Form>
    );
};

export default Edit;
