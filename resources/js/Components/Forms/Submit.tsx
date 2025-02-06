interface Props {
    processing: boolean,
    label?: string,
}

const Submit = ({
    processing,
    label = 'Submit',
}: Props) => {
    return (
        <button
            type="submit"
            disabled={processing}
            className="px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50"
        >
            {processing ? 'Submitting...' : label}
        </button>
    );
}

export default Submit;
