import { connect } from "react-redux";

import MenuDropdownComponent from "./MenuDropdownComponent";
import mapDispatchToProps from "../../theme/ThemeD2P";

export function mapStateToProps(state: any, myProps: any) {
  return {
    data: state.theme.data
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuDropdownComponent);
