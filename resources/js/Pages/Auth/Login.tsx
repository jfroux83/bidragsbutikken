import React from "react";
import {Head, useForm} from "@inertiajs/react";
import Form from "@/Components/Forms/Form";
import TextField from "@/Components/Forms/TextField";
import Password from "@/Components/Forms/Password";
import ButtonRow from "@/Components/Forms/ButtonRow";
import Submit from "@/Components/Forms/Submit";

const Login = () => {

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Bidragsbutikken | Login" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-full max-w-md p-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <div className="flex justify-center mb-6">
                                <img
                                    src="/images/dummy.svg"
                                    alt="Logo"
                                    className="h-12 w-auto object-contain"
                                />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Bidragsbutikken Login</h2>
                            <p className="text-gray-500">Please sign in to your account</p>
                        </div>

                        {/* Form */}
                        <Form onSubmit={handleSubmit}>
                            <TextField
                                name="email"
                                label="Email"
                                value={data.email}
                                onChange={(e: any) => setData('email', e.target.value)}
                                error={errors['email']}
                            />

                            <Password
                                name="password"
                                label="Password"
                                value={data.password}
                                onChange={(e: any) => setData('password', e.target.value)}
                                error={errors['password']}
                            />

                            <ButtonRow>
                                <Submit
                                    processing={processing}
                                    label="Login"
                                />
                            </ButtonRow>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
