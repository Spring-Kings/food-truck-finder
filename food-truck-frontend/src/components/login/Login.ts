import { connect } from "react-redux";

import mapDispatchToProps from "../dashboards/DashboardD2P";
import {mapStateToProps} from "../dashboards/user/UserDashboard";
import LoginComponent from "./LoginComponent";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);