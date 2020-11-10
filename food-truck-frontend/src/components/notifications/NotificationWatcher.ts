import { connect } from "react-redux";

import NotificationWatcherComponent from "./NotificationWatcherComponent";
import mapDispatchToProps from "./NotificationD2P";
import { mapStateToProps } from "./Notifications";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationWatcherComponent);