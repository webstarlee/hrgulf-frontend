import PropTypes from 'prop-types';
import React, { useEffect }  from 'react';
import { useTranslation } from 'react-i18next';

const useTranslateFormErrors = (errors, touched, setFieldTouched) => {
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.on('languageChanged', lng => {
      console.log("WithTranslateFormErrors", errors, touched);
      Object.keys(errors).forEach(fieldName => {
        if (Object.keys(touched).includes(fieldName)) {
          setFieldTouched(fieldName, false);
        }
      });
    });
    return () => {
      i18n.off('languageChanged', lng => {});
    };
  }, [errors]);
};


const WithTranslateFormErrors = ({ errors, touched, setFieldTouched,  children }) => {
  useTranslateFormErrors(errors, touched, setFieldTouched);
  return <>{children}</>;
};

WithTranslateFormErrors.propTypes = {
  form: PropTypes.object
};

export default WithTranslateFormErrors;