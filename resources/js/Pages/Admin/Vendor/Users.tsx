import React, {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "@/Lib/toast";
import {Action} from "@/Components/DataTable/DataTable";
import {KeyRound, Trash2} from "lucide-react";
import Spinner from "@/Components/UI/Spinner";
import {ClientDataTable} from "@/Components/DataTable/ClientDataTable";
import ConfirmationDialog from "@/Components/UI/ConfirmationDialog";

interface Props {
    vendorId: number;
}

const Users = ({
    vendorId
}: Props) => {

    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`/admin/vendor/users/${vendorId}`, {
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

    const handlePasswordReset = async (row: any) => {
        try {
            const response = await axios.post('/admin/vendor/users/password-reset', {
                userId: row.id
            }, {
                headers: {
                    "Content-Type": "application/json",
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.data.message === 'success') {
                toast.success('User password successfully reset');
            } else {
                toast.error('Something went wrong. Please try again');
            }

        } catch (error) {
            console.error(error.message);
            toast.error('Something went wrong. Please try again');
        }
    };

    const handleDelete = (row: any) => {
        setRecordToDelete(row);
        setDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (deleteConfirm) {
            try {
                const response = await axios.post('/admin/vendor/users', {
                    vendorId,
                    userId: recordToDelete.id
                }, {
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
            }
        }
    };

    const actions: Action[] = [
        { label: 'Reset Password', icon: KeyRound, onClick: handlePasswordReset, variant: 'secondary' },
        { label: 'Delete Organization User', icon: Trash2, onClick: handleDelete, variant: 'danger' }
    ];

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <div>
                    <ClientDataTable
                        columns={columns}
                        data={users}
                        actions={actions}
                    />

                    <ConfirmationDialog
                        isOpen={deleteConfirm}
                        onClose={() => {
                            setDeleteConfirm(false);
                            setRecordToDelete(null);
                        }}
                        onConfirm={confirmDelete}
                        title='Delete Vendor User'
                        message={`Are you sure you want to delete vendor user ${recordToDelete?.name}? This action cannot be undone.`}
                        confirmText='Delete'
                        type='danger'
                    />
                </div>
            )}
        </>
    );
};

export default Users;
