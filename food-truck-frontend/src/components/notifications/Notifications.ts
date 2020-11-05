import { connect } from "react-redux";

import NotificationListComponent from "./NotificationListComponent";
import mapDispatchToProps from "./NotificationD2P";

function mapStateToProps(state: any, myProps: any) {
  return {
    data: state.notifications.data
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationListComponent);
