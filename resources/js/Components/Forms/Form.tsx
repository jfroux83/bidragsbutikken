const Form = ({
    onSubmit,
    classNames = '',
    children
}) => {

    return (
        <form
            onSubmit={onSubmit}
            className={`p-6 border rounded-md ${classNames}`}
        >
            {children}
        </form>
    );
}

export default Form;
