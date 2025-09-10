import { useState, useEffect } from 'react';
import styles from './Pagination.module.css';

const Pagination = ({
    centrer,
    totalNbElement,
    nbElementParPage,
    numCurrentPageActive,
    setterCurrentNumPageActive
}) => {
    
const nbPages = Math.ceil(totalNbElement / nbElementParPage);
const pages = [];

const handleClicChangeCurrentPage = (btnClicked) => {

    switch(btnClicked) {
        case "first":
            numCurrentPageActive > 1 && setterCurrentNumPageActive(numCurrentPageActive -1);
            break;
        case "last":
            numCurrentPageActive < nbPages && setterCurrentNumPageActive(numCurrentPageActive +1);
            break;
        default:
            try {
                setterCurrentNumPageActive(parseInt(btnClicked, 10))
            }
            catch {
                setterCurrentNumPageActive(1);
            }
            break;
    }
}

if (nbPages <= 7) {
    for (let i = 1; i <= nbPages; i++) {
        pages.push(
            numCurrentPageActive == i ?
                <li key={"pagin" + i.toString()} className="page-item" aria-current="page">
                    <a className={`page-link ${styles.active}`} href="#">{i}</a>
                </li>
            : 
                <li key={"pagin" + i.toString()} className="page-item">
                    <a className={`page-link ${styles.nonActive}`} href="#" onClick={(e) => handleClicChangeCurrentPage(e.target.text)}>{i}</a>
                </li>
        );
    };
} else {
        pages.push(
            (numCurrentPageActive == 1 ?
                <li key={"pagin1"} className="page-item" aria-current="page">
                    <a className={`page-link ${styles.active}`} href="#">1</a>
                </li>
            : 
                <li key={"pagin1"} className="page-item">
                    <a className={`page-link ${styles.nonActive}`} href="#" onClick={(e) => handleClicChangeCurrentPage(e.target.text)}>1</a>
                </li>
            )
        );
        pages.push(
                <li key={"paginInactive"} className="page-item">
                    <a className={`page-link ${styles.inactive}`}>...</a>
                </li>
        );
        pages.push(
            (numCurrentPageActive !== nbPages && numCurrentPageActive !== 1 ?
                <li key={"pagin" + numCurrentPageActive.toString()} className="page-item" aria-current="page">
                    <a className={`page-link ${styles.active}`} href="#">{numCurrentPageActive.toString()}</a>
                </li>
            : ""
            )
        );
        pages.push(
            (numCurrentPageActive !== nbPages && numCurrentPageActive !== 1 ?
                <li key={"paginInactiveBis"} className="page-item">
                    <a className={`page-link ${styles.inactive}`}>...</a>
                </li>
            : ""
            )
        );
        pages.push(
            (numCurrentPageActive == nbPages ?
                <li key={"pagin" + nbPages.toString()} className="page-item" aria-current="page">
                    <a className={`page-link ${styles.active}`} href="#">{nbPages}</a>
                </li>
            : 
                <li key={"pagin" + nbPages.toString()} className="page-item">
                    <a className={`page-link ${styles.nonActive}`} href="#" onClick={(e) => handleClicChangeCurrentPage(e.target.text)}>{nbPages}</a>
                </li>
            )
        );
    };

return (
        <ul className={`pagination ${centrer && "justify-content-center"}`}>
            <li className="page-item">
                <a className={`page-link ${styles.nonActive}`} href="#" aria-label="Previous" onClick={(e) => handleClicChangeCurrentPage("first")}>
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
                {pages}
            <li className="page-item">
                <a className={`page-link ${styles.nonActive}`} href="#" aria-label="Next" onClick={(e) => handleClicChangeCurrentPage("last")}>
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul> 
  );
};

export default Pagination;

    // import Pagination from '../../components/others/Pagination';
    // Pagination : Début //
    // const nbArticlesParPage = 3;
    // const [numCurrentPagePaginationActive, setNumCurrentPagePaginationActive] = useState(1);
    // Pagination : Fin //