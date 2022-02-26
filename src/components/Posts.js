const Posts = ({ data, ...props }) => {
    return (
        <ul className="list-group">
            {data.length > 0 &&
                data.map((e, i) => (
                    <li key={i + 1} className="list-group-item">
                        {e.id} :- {e.title}
                    </li>
                ))}
        </ul>
    );
};

export default Posts;
