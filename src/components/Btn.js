const Btn = ({ title, action, isDisabled = false, classes = "", ...props }) => {
    return (
        <button className={`btn rounded-1 mx-1 ${classes}`} disabled={isDisabled} {...props} onClick={(e) => action(e)}>
            {title}
        </button>
    );
};

export default Btn;
