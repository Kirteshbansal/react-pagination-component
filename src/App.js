import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import Pagination from "./components/Pagination";
import Posts from "./components/Posts";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
    const [post, setPost] = useState([]);
    const [paginatedRes, setPaginatedRes] = useState({});
    const paginatedData = post.slice(paginatedRes.initialIndex, paginatedRes.endIndex);

    useEffect(() => {
        (async () => {
            const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
            setPost(res.data);
        })();
    }, []);

    const onChangeHandler = useCallback((res) => setPaginatedRes(res), []);

    return (
        <div className="container my-5">
            <Posts data={paginatedData} />
            <Pagination
                itemsPerPage={8}
                showFirstButton
                showLastButton
                totalItems={post.length}
                onChange={onChangeHandler}
            />
        </div>
    );
};

export default App;
