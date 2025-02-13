interface Props {
    status: string;
}

const StatusBadge = ({ status }: Props) => {

    const colors = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        processing: 'bg-blue-100 text-blue-800 border-blue-200',
        completed: 'bg-green-100 text-green-800 border-green-200',
        failed: 'bg-red-100 text-red-800 border-red-200'
    }

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex
             border ${colors[status] || colors['pending']}`}>
      {status}
    </span>
    )
};

export default StatusBadge;
