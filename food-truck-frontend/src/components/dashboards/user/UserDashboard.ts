import { connect } from "react-redux";

import UserDashboardComponent from "./react/UserDashboardComponent";
import mapDispatchToProps from "./redux/UserDashboardD2P";

/**
 * Maps the current Redux state into my props, as needed.
 * @param state The state of the Redux store. Any since I don't know what's in the store, but I recall there's a better pattern.
 * @param myProps My own current props
 */
function mapStateToProps(state: any, myProps: any) {
  return {
    data: state.user.data
  };
}

/**
 * Export the connection
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDashboardComponent);
