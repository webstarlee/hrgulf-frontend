import {MDBCol, MDBContainer, MDBFooter, MDBRow} from "mdbreact";
import React from "react";
import {useTranslation} from "react-i18next";

import {SOCIAL} from "core/globals";
import images from "core/images";

import "./Footer.scss";

export default (props) => {
  const {t} = useTranslation();

  const dir = t('DIRECTION');
  const classTextAlignRight = dir === 'rtl' ? 'text-right-lg' : '';

  return (
    <MDBFooter color="unique-color-dark" className="font-small pt-4">
      <MDBContainer className="text-center text-md-left">
        <MDBRow className="text-center text-md-left mt-3 pb-3">
          <MDBCol md="3" lg="3" xl="3" className={`mx-auto mt-3 ${classTextAlignRight}`}>
            {/*<h6 className="text-uppercase mb-4 font-weight-bold">*/}
            {/*  Company name*/}
            {/*</h6>*/}
            {/*<div className="footer-company-logo"></div>*/}
            <img src={images.logo.logoNoTitle300} className="footer-company-logo"/>
            <p className="mt-4">{t("FOOTER.COMPANY_NAME")}</p>
          </MDBCol>
          <hr className="w-100 clearfix d-md-none" />
          {/*<MDBCol md="2" lg="2" xl="2" className={`mx-auto mt-3 ${classTextAlignRight}`}>*/}
          {/*  /!*<h6 className="text-uppercase mb-4 font-weight-bold">Products</h6>*!/*/}
          {/*  /!*<p>*!/*/}
          {/*  /!*  <a>MDBootstrap</a>*!/*/}
          {/*  /!*</p>*!/*/}
          {/*  /!*<p>*!/*/}
          {/*  /!*  <a>MDWordPress</a>*!/*/}
          {/*  /!*</p>*!/*/}
          {/*  /!*<p>*!/*/}
          {/*  /!*  <a>BrandFlow</a>*!/*/}
          {/*  /!*</p>*!/*/}
          {/*  /!*<p>*!/*/}
          {/*  /!*  <a>Bootstrap Angular</a>*!/*/}
          {/*  /!*</p>*!/*/}
          {/*</MDBCol>*/}
          {/*<hr className="w-100 clearfix d-md-none" />*/}
          {/*<MDBCol md="3" lg="2" xl="2" className={`mx-auto mt-3 ${classTextAlignRight}`}>*/}
          {/*  /!*<h6 className="text-uppercase mb-4 font-weight-bold">*!/*/}
          {/*  /!*  Useful links*!/*/}
          {/*  /!*</h6>*!/*/}
          {/*  /!*<p>*!/*/}
          {/*  /!*  <a>Your Account</a>*!/*/}
          {/*  /!*</p>*!/*/}
          {/*  /!*<p>*!/*/}
          {/*  /!*  <a>Become an Affiliate</a>*!/*/}
          {/*  /!*</p>*!/*/}
          {/*  /!*<p>*!/*/}
          {/*  /!*  <a>Shipping Rates</a>*!/*/}
          {/*  /!*</p>*!/*/}
          {/*  /!*<p>*!/*/}
          {/*  /!*  <a>Help</a>*!/*/}
          {/*  /!*</p>*!/*/}
          {/*</MDBCol>*/}
          {/*<hr className="w-100 clearfix d-md-none" />*/}
          <MDBCol md="4" lg="3" xl="3" className={`mx-auto mt-3 ${classTextAlignRight}`}>
            <h6 className="text-uppercase mb-4 font-weight-bold">{t("FOOTER.CONTACT")}</h6>
            <p>
              <i className="fa fa-home mr-3" /> {t("FOOTER.ADDRESS")}
            </p>
            <p>
              <i className="fa fa-phone mr-3" /> {t("FOOTER.MOBILE")}
            </p>
            <p>
              <i className="fa fa-phone mr-3" /> {t("FOOTER.PHONE")}
            </p>
            <p>
              <i className="fa fa-envelope mr-3" /> {t("FOOTER.EMAIL")}
            </p>
          </MDBCol>
        </MDBRow>
        <hr />
        <MDBRow className="d-flex align-items-center">
          <MDBCol md="4">
            {/*<p className="text-center text-md-left grey-text">*/}
            {/*  &copy; {new Date().getFullYear()} Copyright:{" "}*/}
            {/*  <a href="https://www.MDBootstrap.com"> MDBootstrap.com </a>*/}
            {/*</p>*/}
          </MDBCol>
          <MDBCol md="8">
            <div className="text-center text-md-right">
              <ul className="list-unstyled list-inline">
                <li className="list-inline-item">
                  <a className="btn-floating btn-sm rgba-white-slight mx-1" href={SOCIAL.LINKS.TWITTER} target="_blank">
                    <i className="fab fa-twitter" />
                  </a>
                </li>
                <li className="list-inline-item">
                  <a className="btn-floating btn-sm rgba-white-slight mx-1" href={SOCIAL.LINKS.YOUTUBE} target="_blank">
                    <i className="fab fa-youtube" />
                  </a>
                </li>
                <li className="list-inline-item">
                  <a className="btn-floating btn-sm rgba-white-slight mx-1" href={SOCIAL.LINKS.LINKEDIN} target="_blank">
                    <i className="fab fa-linkedin-in" />
                  </a>
                </li>
                <li className="list-inline-item">
                  <a className="btn-floating btn-sm rgba-white-slight mx-1" href={SOCIAL.LINKS.SNAPCHAT} target="_blank">
                    <i className="fab fa-snapchat" />
                  </a>
                </li>
                <li className="list-inline-item">
                  <a className="btn-floating btn-sm rgba-white-slight mx-1" href={SOCIAL.LINKS.WHATSAPP} target="_blank">
                    <i className="fab fa-whatsapp" />
                  </a>
                </li>
              </ul>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </MDBFooter>
  )
}