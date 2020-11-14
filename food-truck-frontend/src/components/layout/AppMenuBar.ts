import { connect } from "react-redux";

import mapDispatchToProps from "../dashboards/DashboardD2P";
import {mapStateToProps} from "../dashboards/user/UserDashboard";
import {AppMenuBarComponent} from "./AppMenuBarComponent";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppMenuBarComponent);