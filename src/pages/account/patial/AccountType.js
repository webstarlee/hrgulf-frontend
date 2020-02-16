import React, {useState} from "react";
import {MDBBtn, MDBCol, MDBFormInline, MDBInput, MDBRow} from "mdbreact";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {Formik} from "formik";

import authActions from "actions/auth";
import {ACCOUNT, AUTH, DEFAULT, PROJECT, RESULT, SOCIAL, VALIDATION} from "core/globals";
import Service from "services/AccountService";
import toast from "components/MyToast";

import "./AccountType.scss";

export default (props) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {auth: {user}} = useSelector(state => state);

  const [isSubmitting, setSubmitting] = useState(false);
  const [type, setType] = useState(user.accountType);

  const handleSubmit = e => {
    e.preventDefault();

    setSubmitting(true);
    Service.changeAccountType({id: user.id, type})
      .then(res => {
        setSubmitting(false);
        if (res.result === RESULT.SUCCESS) {
          toast.success(res.message);
          dispatch(authActions.successSignIn(res.data));
          const authData = JSON.stringify({
            signedIn: true,
            user: res.data.user,
            token: res.data.token,
          });
          sessionStorage.setItem(PROJECT.PERSIST_KEY, authData);
          !!localStorage.getItem(PROJECT.PERSIST_KEY) && localStorage.setItem(PROJECT.PERSIST_KEY, authData);
        } else {
          toast.error(res.message);
        }
      })
      .catch(err => {
        setSubmitting(false);
        toast.error(t("COMMON.ERROR.UNKNOWN_SERVER_ERROR"));
      });
  };

  const payload = () => (
    <div className="mt-4">
      <h4 className="h4-responsive text-left grey-text">{t("ACCOUNT.ACCOUNT_TYPE.ACCOUNT_TYPE")}</h4>
      <div className="text-center">
        <MDBFormInline onSubmit={handleSubmit} className="mx-0 mx-lg-5">
          <MDBInput
            onClick={e => setType(ACCOUNT.TYPE.HIRE)}
            checked={type === ACCOUNT.TYPE.HIRE}
            label={t("COMMON.ACCOUNT_TYPE.HIRE")}
            type="radio"
            id="radHire"
            containerClass="mr-5"
          />
          <MDBInput
            onClick={e => setType(ACCOUNT.TYPE.WORK)}
            checked={type === ACCOUNT.TYPE.WORK}
            label={t("COMMON.ACCOUNT_TYPE.WORK")}
            type="radio"
            id="radWork"
            containerClass="mr-5"
          />

          <div className="text-center mt-4 mb-3">
            <MDBBtn type="submit" color="primary" rounded className="z-depth-1a"
                    disabled={!!isSubmitting}>
              {!!isSubmitting && <div className="spinner-grow spinner-grow-sm" role="status"/>}
              {!isSubmitting && t("COMMON.BUTTON.CHANGE")}
            </MDBBtn>
          </div>
        </MDBFormInline>
      </div>
    </div>
  );

  return payload();
}