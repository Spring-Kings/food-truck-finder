import { connect } from "react-redux";

import { FoodTruckThemeProvider } from "./FoodTruckThemeProvider";
import mapDispatchToProps from "./ThemeD2P";

export function mapStateToProps(state: any, myProps: any) {
  return {
    data: state.theme.data
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FoodTruckThemeProvider);
