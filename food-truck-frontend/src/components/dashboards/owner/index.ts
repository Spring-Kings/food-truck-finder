import { connect } from "react-redux";
import mapDispatchToProps from "../DashboardD2P";
import OwnerDashboardComponent from "./OwnerDashboardComponent";

function mapStateToProps(state: any, myProps: any) {
    return {
      data: state.user.data
    };
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(OwnerDashboardComponent);