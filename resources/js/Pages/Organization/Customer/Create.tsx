import React from "react";
import {Head, router, useForm} from "@inertiajs/react";
import OrganizationLayout from "@/Layouts/OrganizationLayout";
import PageLayout from "@/Components/UI/PageLayout";
import Form from "@/Components/Forms/Form";
import TextField from "@/Components/Forms/TextField";
import Select from "@/Components/Forms/Select";
import ButtonRow from "@/Components/Forms/ButtonRow";
import Submit from "@/Components/Forms/Submit";
import {CornerDownLeft} from "lucide-react";

interface Props {
    postalCodes: Array<{
        label: string;
        value: string;
    }>;
}

const Create = ({
    postalCodes
}: Props) => {

    const { data, setData, post, processing, errors } = useForm({
        lastName: '',
        firstName: '',
        email: '',
        telephone: '',
        postalCode: '',
        city: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/organization/customer');
    };

    const handleReturn = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/organization/customer');
    };

    const actions = [
        { label: "Return", icon: CornerDownLeft, onClick: handleReturn, variant: 'secondary' },
    ];

    return (
        <OrganizationLayout>
            <Head title="Customer | Register" />
            <PageLayout
                title="Customer | Register"
                // @ts-ignore
                actions={actions}
            >
                <Form onSubmit={handleSubmit}>
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
                            label="Telephone (optional)"
                            value={data.telephone}
                            onChange={(e: any) => setData('telephone', e.target.value)}
                            error={errors.telephone}
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
                            label="Postal Code (optional)"
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

                    <ButtonRow>
                        <Submit processing={processing} />
                    </ButtonRow>
                </Form>
            </PageLayout>
        </OrganizationLayout>
    );
};

export default Create;
