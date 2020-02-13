import React, {Fragment, useEffect, useState} from "react";
import {MDBIcon, MDBPageItem, MDBPageNav, MDBPagination} from "mdbreact";
import {PAGINATION} from "core/globals";
import {isMobile} from "react-device-detect";
import {useTranslation} from "react-i18next";

export default ({circle, current, pageCount, width, onChange}) => {
  const {t} = useTranslation();

  const [pages, setPages] = useState([]);

  const dir1 = t("DIRECTION") === "ltr" ? "left" : "right";
  const dir2 = t("DIRECTION") === "ltr" ? "right" : "left";

  useEffect(e => {
    !width && (width = isMobile ? PAGINATION.WIDTH_MOBILE : PAGINATION.WIDTH);
    const half = Math.ceil(width / 2);
    let begin = (current - half) < 1 ? 1 : (current - half);
    let end = (current + half - 1) > pageCount ? pageCount : (current + half - 1);

    if ((end - begin) < width) {
      begin === 1 && (end = pageCount < width ? pageCount : width);
      end === pageCount && (begin = (pageCount - width + 1) < 1 ? 1 : (pageCount - width + 1));
    }

    let pages = [];
    for (let i = begin; i <= end; i++) {
      pages.push(i);
    }
    setPages(pages);
  }, [current, pageCount, width]);
  return (
    <Fragment>
      {pageCount > 0 && <MDBPagination circle={circle}>
        <MDBPageItem disabled={current === 1} onClick={() => onChange(1)}>
          <MDBPageNav className="page-link">
            <MDBIcon icon={`angle-double-${dir1}`} />
          </MDBPageNav>
        </MDBPageItem>
        <MDBPageItem disabled={current === 1} onClick={() => onChange(current - 1)}>
          <MDBPageNav className="page-link">
            <MDBIcon icon={`angle-${dir1}`} />
          </MDBPageNav>
        </MDBPageItem>
        {pages.map((page, index) => (
          <MDBPageItem key={page} active={page === current} onClick={() => current !== page && onChange(page)}>
            <MDBPageNav className="page-link">{page}</MDBPageNav>
          </MDBPageItem>
        ))}
        <MDBPageItem disabled={current === pageCount} onClick={() => onChange(current + 1)}>
          <MDBPageNav className="page-link">
            <MDBIcon icon={`angle-${dir2}`} />
          </MDBPageNav>
        </MDBPageItem>
        <MDBPageItem disabled={current === pageCount} onClick={() => onChange(pageCount)}>
          <MDBPageNav className="page-link">
            <MDBIcon icon={`angle-double-${dir2}`} />
          </MDBPageNav>
        </MDBPageItem>
      </MDBPagination>}
    </Fragment>
  )
}
