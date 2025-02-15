import React from 'react';
import {Head, useForm} from "@inertiajs/react";
import PageLayout from "@/Components/UI/PageLayout";
import GuestLayout from "@/Layouts/GuestLayout";
import Form from "@/Components/Forms/Form";
import TextField from "@/Components/Forms/TextField";
import Password from "@/Components/Forms/Password";
import ButtonRow from "@/Components/Forms/ButtonRow";
import Submit from "@/Components/Forms/Submit";
import {TriangleAlert} from "lucide-react";

interface Props {
    email: string;
    token: string;
}

const CreatePassword = ({
    email,
    token
}: Props) => {
    const {data, setData, post, processing, errors} = useForm({
        email: email,
        token: token,
        temporary_password: '',
        password: '',
        password_confirmation: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/password/store');
    };

    return (
        <GuestLayout>
            <Head title="Set Up Your Password"/>
            <PageLayout
                title="Set Up Your Password"
                containerClassName="bg-white shadow rounded-md mt-2 max-w-2xl mx-auto"
            >
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-3">
                    <TriangleAlert className="w-5 h-5 text-blue-500 mt-0.5"/>
                    <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">Password Requirements:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Minimum 12 characters long</li>
                            <li>At least one uppercase letter</li>
                            <li>At least one lowercase letter</li>
                            <li>At least one number</li>
                            <li>At least one special character (!@#$%^&*()_-+=&lt;&gt;?)</li>
                        </ul>
                    </div>
                </div>

                <Form onSubmit={handleSubmit}>
                    <TextField
                        name="email"
                        label="Email"
                        value={data.email}
                        onChange={(e: any) => setData('email', e.target.value)}
                        error={errors['email']}
                        required={true}
                        disabled={true}
                    />

                    <Password
                        name="temporary_password"
                        label="Temporary Password (Enter the temporary password from your welcome email)"
                        value={data.temporary_password}
                        onChange={(e: any) => setData('temporary_password', e.target.value)}
                        error={errors['temporary_password']}
                        required={true}
                    />

                    <Password
                        name="password"
                        label="New Password"
                        value={data.password}
                        onChange={(e: any) => setData('password', e.target.value)}
                        error={errors['password']}
                        required={true}
                    />

                    <Password
                        name="password_confirmation"
                        label="Confirm New Password"
                        value={data.password_confirmation}
                        onChange={(e: any) => setData('password_confirmation', e.target.value)}
                        error={errors['password_confirmation']}
                        required={true}
                    />

                    <ButtonRow>
                        <Submit processing={processing} />
                    </ButtonRow>
                </Form>
            </PageLayout>
        </GuestLayout>
    );
};

export default CreatePassword;
