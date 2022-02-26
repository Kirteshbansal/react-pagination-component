import { useMemo, useState, useEffect, useCallback } from "react";
import Btn from "./Btn";

const range = (from, to) => {
    let i = from;
    const range = [];
    for (i; i <= to; i++) {
        range.push(i);
    }
    return range;
};

const Pagination = ({
    totalItems,
    itemsPerPage,
    showPrev = true,
    showNext = true,
    defaultPage = 1,
    onChange,
    pageNeighbors = 2,
    showFirstButton,
    showLastButton,
    ...props
}) => {
    const [currPage, setCurrPage] = useState(defaultPage);
    const [showBtns, setShowBtns] = useState([]);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const lastPageIndex = useMemo(() => currPage * itemsPerPage, [itemsPerPage, currPage]);
    const firstPageIndex = useMemo(() => lastPageIndex - itemsPerPage, [itemsPerPage, lastPageIndex]);

    pageNeighbors = typeof pageNeighbors === "number" ? Math.max(0, Math.min(pageNeighbors, 2)) : 0;

    const handlePageChange = (num) => {
        setCurrPage(num);
    };

    const handlePageViews = () => {
        return showBtns.map((number, i) => {
            if (number === null) {
                return <Btn classes={"bg-transparent"} action={() => {}} isDisabled={true} title={"..."} key={i + 1} />;
            }
            return (
                <Btn
                    classes={`${currPage === number ? "btn-primary bg-primary" : "bg-transparent"}`}
                    action={() => handlePageChange(number)}
                    title={number}
                    key={i + 1}
                />
            );
        });
    };

    const fetchPageNumbers = useCallback(() => {
        const totalNumbers = pageNeighbors * 2 + 3;
        if (totalPages > totalNumbers) {
            const startPage = Math.max(2, currPage - pageNeighbors);
            const endPage = Math.min(totalPages - 1, currPage + pageNeighbors);
            let pages = range(startPage, endPage);

            const hasLeftSpill = startPage > 2;
            const hasRightSpill = totalPages - endPage > 1;
            const hiddenPages = totalNumbers - (pages.length + 1);
            console.table({ startPage, endPage, totalPages, hasLeftSpill, hasRightSpill, hiddenPages });
            switch (true) {
                // handle: (1) < {5 6} [7] {8 9} (10)
                case hasLeftSpill && !hasRightSpill: {
                    const extraPages = range(startPage - hiddenPages, startPage - 1);
                    pages = [null, ...extraPages, ...pages];
                    break;
                }
                // handle: (1) {2 3} [4] {5 6} > (10)
                case !hasLeftSpill && hasRightSpill: {
                    const extraPages = range(endPage + 1, endPage + hiddenPages);
                    pages = [...pages, ...extraPages, null];
                    break;
                }
                // handle: (1) < {4 5} [6] {7 8} > (10)
                case hasLeftSpill && hasRightSpill:
                default: {
                    pages = [null, ...pages, null];
                    break;
                }
            }
            return [1, ...pages, totalPages];
        }
        return range(1, totalPages);
    }, [currPage, pageNeighbors, totalPages]);

    useEffect(() => {
        setShowBtns(fetchPageNumbers());
        onChange({
            initialIndex: firstPageIndex,
            endIndex: lastPageIndex,
        });
    }, [fetchPageNumbers, firstPageIndex, lastPageIndex, onChange]);
    return (
        <>
            {showBtns.length > 0 && (
                <div className="d-flex flex-wrap my-2">
                    {showFirstButton && (
                        <Btn
                            classes={``}
                            action={() => handlePageChange(showBtns[0])}
                            title="&laquo;"
                            isDisabled={currPage === showBtns[0]}
                        />
                    )}
                    {showPrev && (
                        <Btn
                            classes={``}
                            action={() => handlePageChange(currPage - 1)}
                            title="&lsaquo;"
                            isDisabled={currPage === showBtns[0]}
                        />
                    )}
                    {handlePageViews()}
                    {showNext && (
                        <Btn
                            classes={``}
                            action={() => handlePageChange(currPage + 1)}
                            title="&rsaquo;"
                            isDisabled={currPage === showBtns[showBtns.length - 1]}
                        />
                    )}
                    {showLastButton && (
                        <Btn
                            classes={``}
                            action={() => handlePageChange(showBtns[showBtns.length - 1])}
                            title="&raquo;"
                            isDisabled={currPage === showBtns[showBtns.length - 1]}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default Pagination;
