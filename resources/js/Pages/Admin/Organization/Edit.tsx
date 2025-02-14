import React from "react";
import {router, useForm} from "@inertiajs/react";
import Form from "@/Components/Forms/Form";
import Radio from "@/Components/Forms/Radio";
import TextField from "@/Components/Forms/TextField";
import ButtonRow from "@/Components/Forms/ButtonRow";
import Submit from "@/Components/Forms/Submit";
import {CornerDownLeft, Mail} from "lucide-react";
import Select from "@/Components/Forms/Select";

interface Props {
    organization: {
        id: number;
        status: boolean;
        name: string;
        registrationNumber: string;
        address1: string;
        address2: string;
        city: string;
        postalCode: string;
        telephone: string;
        email: string;
    };
    postalCodes: Array<{
        label: string;
        value: string;
    }>;
}

const Edit = ({
    organization,
    postalCodes
}: Props) => {

    const { data, setData, put, processing, errors } = useForm({
        status: organization.status,
        name: organization.name,
        registrationNumber: organization.registrationNumber,
        address1: organization.address1,
        address2: organization.address2,
        city: organization.city,
        postalCode: organization.postalCode,
        telephone: organization.telephone,
        email: organization.email,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/organization/${organization.id}`);
    };

    const handleReturn = () => {
        router.get('/admin/organization');
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                    name="name"
                    label="Name"
                    value={data.name}
                    onChange={(e: any) => setData('name', e.target.value)}
                    error={errors.name}
                    required={true}
                />

                <TextField
                    name="registrationNumber"
                    label="Registration Number"
                    value={data.registrationNumber}
                    onChange={(e: any) => setData('registrationNumber', e.target.value)}
                    error={errors.registrationNumber}
                />
            </div>

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

            <ButtonRow>
                <Submit processing={processing} />
            </ButtonRow>
        </Form>
    );
};

export default Edit;
