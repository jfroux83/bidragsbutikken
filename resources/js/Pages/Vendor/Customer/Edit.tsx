import Form from "@/Components/Forms/Form";
import TextField from "@/Components/Forms/TextField";
import Select from "@/Components/Forms/Select";
import ButtonRow from "@/Components/Forms/ButtonRow";
import Submit from "@/Components/Forms/Submit";
import React from "react";
import {useForm} from "@inertiajs/react";
import Radio from "@/Components/Forms/Radio";

interface Props {
    customer: {
        id: number;
        status: boolean;
        firstName: string;
        lastName: string;
        street1: string;
        street2: string;
        city: string;
        postalCode: string;
        telephone: string;
        email: string;
        referredBy: string;
    };
    postalCodes: Array<{
        label: string;
        value: string;
    }>;
}

const Edit = ({
    customer,
    postalCodes
}: Props) => {

    const { data, setData, put, processing, errors } = useForm({
        lastName: customer.lastName,
        firstName: customer.firstName,
        email: customer.email,
        telephone: customer.telephone,
        street1: customer.street1,
        street2: customer.street2,
        postalCode: customer.postalCode,
        city: customer.city,
        status: customer.status,
        referredBy: customer.referredBy,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        put(`/vendor/customer/${customer.id}`);
    };

    return (
        <>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        name="lastName"
                        label="Last Name"
                        value={data.lastName}
                        onChange={(e: any) => setData('lastName', e.target.value)}
                        error={errors.lastName}
                        required
                    />

                    <TextField
                        name="firstName"
                        label="First Name"
                        value={data.firstName}
                        onChange={(e: any) => setData('firstName', e.target.value)}
                        error={errors.firstName}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        name="email"
                        label="Email"
                        value={data.email}
                        onChange={(e: any) => setData('email', e.target.value)}
                        error={errors.email}
                        required
                    />

                    <TextField
                        name="telephone"
                        label="Telephone"
                        value={data.telephone}
                        onChange={(e: any) => setData('telephone', e.target.value)}
                        error={errors.telephone}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        name="street1"
                        label="Address 1"
                        value={data.street1}
                        onChange={(e: any) => setData('street1', e.target.value)}
                        error={errors.street1}
                    />

                    <TextField
                        name="street2"
                        label="Address 2"
                        value={data.street2}
                        onChange={(e: any) => setData('street2', e.target.value)}
                        error={errors.street2}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        name="city"
                        label="City"
                        value={data.city}
                        onChange={null}
                        error={errors.city}
                        disabled
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
                        name="referredBy"
                        label="Referred By"
                        value={data.referredBy}
                        onChange={null}
                        error={errors.referredBy}
                        disabled
                    />
                </div>

                <ButtonRow>
                    <Submit processing={processing} />
                </ButtonRow>
            </Form>
        </>
    );
};

export default Edit;
