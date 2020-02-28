import PropTypes from "prop-types";

export default {
  collapse: PropTypes.bool.isRequired,
  dropdown: PropTypes.object.isRequired,
  onChangeCollapse: PropTypes.func.isRequired,
  onOpenDropdown: PropTypes.func.isRequired,
  onCloseDropdown: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onChangeAccountTypeChange: PropTypes.func,
  onChangeLanguage: PropTypes.func,
  onSignOut: PropTypes.func,
};
