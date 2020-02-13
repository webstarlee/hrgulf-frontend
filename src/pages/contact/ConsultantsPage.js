import React, {Fragment, useEffect, useState} from "react";
import {Helmet} from "react-helmet";
import {useTranslation} from "react-i18next";
import {
  MDBAvatar,
  MDBCarousel,
  MDBCarouselInner,
  MDBCarouselItem,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBTestimonial
} from "mdbreact";

import Loading from "components/Loading";
import {ALERT, RESULT, INPUT} from "core/globals";
import Service from "services/ContactService";

import "./ConsultantsPage.scss";

export default () => {
  const {t} = useTranslation();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({});

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [items, setItems] = useState([]);
  const [chunks, setChunks] = useState([]);

  const lang = t("CODE");

  useEffect(e => {
    const isSmallScreen = window.innerWidth < 768;
    setIsSmallScreen(isSmallScreen);
    setAlert({
      ...alert,
      show: false,
    });
    setLoading(true);
    Service.consultants()
      .then(res => {
        if (res.result === RESULT.SUCCESS) {
          setItems(res.data);
          const arr = adjustItems(res.data);
          const chunks = makeChunks(arr, isSmallScreen ? 1 : 3);
          setChunks([chunks[0]]);
        } else {
          setItems([]);
          setChunks([]);
          setAlert({
            show: true,
            color: ALERT.DANGER,
            message: res.message,
          });
        }
        setLoading(false);
      })
      .catch(err => {
        setItems([]);
        setChunks([]);
        setAlert({
          show: true,
          color: ALERT.DANGER,
          message: t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"),
        });
        setLoading(false);
      });
  }, [t]);

  const adjustItems = items => {
    for (let item of items) {
      item["descriptionEn2"] = item["descriptionEn"].length > INPUT.DESCRIPTION_LENGTH_BREAKPOINT ? item["descriptionEn"].substr(0, INPUT.DESCRIPTION_LENGTH_BREAKPOINT) + "..." : item["descriptionEn"];
      item["descriptionAr2"] = item["descriptionAr"].length > INPUT.DESCRIPTION_LENGTH_BREAKPOINT ? item["descriptionAr"].substr(0, INPUT.DESCRIPTION_LENGTH_BREAKPOINT) + "..." : item["descriptionAr"];
    }
    return items;
  };

  const makeChunks = (arr, chunkSize) => {
    let R = [];
    const size = arr.length;
    for (let i = 0, len = size; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  };

  return (
    <Fragment>
      <Helmet>
        <title>{t("CONTACT.CONSULTANTS.CONSULTANTS")} - {t("SITE_NAME")}</title>
      </Helmet>
      <MDBContainer className="section">
        <MDBRow>
          <MDBCol md={12}>
            <h2 className="heading1 text-center font-weight-bold mb-5">{t("CONTACT.CONSULTANTS.CONSULTANTS")}</h2>
          </MDBCol>
          {!!loading && <Loading/>}
          {!loading && <MDBCol md={12}>
            <MDBCarousel activeItem={1} length={chunks.length} slide={true} showControls={true} multiItem testimonial className="my-carousel">
              <MDBCarouselInner>
                <MDBRow>
                  {chunks.map((chunk, index) => (
                    <MDBCarouselItem itemId={index + 1} key={index}>
                      {chunk.map((item, index2) => (
                        <MDBCol md="4" key={`${index}-${index2}`}>
                          <MDBTestimonial className="text-center">
                            <MDBAvatar className="white text-center">
                              {/*<img src={item.media} alt="" className="img-fluid card-avatar" />*/}
                              <div className="card-avatar z-depth-1 mx-auto" style={{backgroundImage: `url(${item.media})`}}/>
                            </MDBAvatar>
                            <h4 className="font-weight-bold mt-4 text-center">{lang === "en" ? item.nameEn : item.nameAr}</h4>
                            <h6 className="font-weight-bold my-3 text-center">{lang === "en" ? item.titleEn : item.titleAr}</h6>
                            <p className="font-weight-normal text-left">{lang === "en" ? item.descriptionEn2 : item.descriptionAr2}</p>
                          </MDBTestimonial>
                        </MDBCol>
                      ))}
                    </MDBCarouselItem>
                  ))}
                </MDBRow>
              </MDBCarouselInner>
            </MDBCarousel>
          </MDBCol>}
        </MDBRow>
      </MDBContainer>
      {/*<Loader />*/}
    </Fragment>
  );
}
