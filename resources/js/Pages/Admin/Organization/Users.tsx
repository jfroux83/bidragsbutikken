import React, {useEffect, useState} from "react";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import {KeyRound} from "lucide-react";
import {Action} from "@/Components/DataTable/DataTable";
import axios from "axios";
import {toast} from "@/Lib/toast";
import Spinner from "@/Components/UI/Spinner";

interface Props {
    organizationId: number;
}

const Users = ({
    organizationId
}: Props) => {

    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`/admin/organization/users/${organizationId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                if (response.data.message === 'success') {
                    setUsers(response.data.users);
                    toast.success('Users successfully loaded');
                } else {
                    toast.error('Something went wrong. Please try again');
                }

            } catch (error) {
                console.error(error.message);
                toast.error('Something went wrong. Please try again');
            } finally {
                setIsLoading(false);
            }
        }

        fetchUsers();
    }, [])

    const columns = [
        {
            key: 'name',
            title: 'Name',
        },
        {
            key: 'email',
            title: 'Email',
        },
        {
            key: 'locale',
            title: 'Locale',
        },
        {
            key: 'status',
            title: 'Status',
            formatter: (value: boolean) => (
                <div className="flex justify-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-2xl shadow
                        ${value === true ? 'bg-green-200 text-green-600' : 'bg-red-200 text-red-600'}
                    `}>
                        {value === true ? 'Active' : 'Inactive' }
                    </span>
                </div>
            )
        }
    ];

    const handlePasswordReset = () => {};

    const actions: Action[] = [
        { label: 'Reset Password', icon: KeyRound, onClick: handlePasswordReset, variant: 'secondary' },
    ];

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <ClientDataTable
                    columns={columns}
                    data={users}
                    actions={actions}
                />
            )}
        </>
    );
};

export default Users;
