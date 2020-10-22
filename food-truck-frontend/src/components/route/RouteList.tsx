import {
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@material-ui/core";
import React from "react";
import { DEFAULT_ERR_RESP } from "../../api/DefaultResponses";
import api from "../../util/api";
import DayOfWeek from "../map/route-map/DayOfWeek";
import RouteListRow from "../RouteListRows";
import CreateRouteDialog from "./CreateRouteDialog";

interface RouteListTruck {
  id: string;
  userId: string;
  name: string;
  schedule: string;
}
interface RouteListRouteInfo {
  routeId: number;
  routeName: string;
  active: boolean;
  days: DayOfWeek[];
}

const TruckObject = {
  id: "",
  userId: "",
  name: "",
  schedule: "",
};

const RouteObject = [
  {
    routeId: 0,
    routeName: "",
    active: false,
    days: []
  },
];

type RouteState = {
  truck: RouteListTruck | undefined;
  routeData: RouteListRouteInfo[];

  errorMsg: string | undefined;
  createRoute: boolean;
};

type RouteProps = {
  truckId: string;
};

class RouteList extends React.Component<RouteProps, RouteState> {
  constructor(props: RouteProps) {
    super(props);
    this.state = {
      truck: undefined,
      routeData: RouteObject,
      errorMsg: undefined,
      createRoute: false,
    };

    this.newRoute = this.newRoute.bind(this);
    this.createSuccess = this.createSuccess.bind(this);
    this.createFailure = this.createFailure.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
  }

  componentDidMount() {
    api
      .get(`/truck/${this.props.truckId}`)
      .then((res) => {
        if (res.data) {
          this.setState({ truck: res.data });
          this.fetchRoutes();
        } else {
          this.setState({ errorMsg: "No truck found by provided ID" });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ errorMsg: err.toString() });
      });
  }

  deleteRow(routeId: string) {
    api
      .delete(`/truck/routes-delete/${routeId}`)
      .then(() => {
        this.fetchRoutes();
      })
      .catch((err) => {
        console.log(err.toString());
      });
  }

  fetchRoutes() {
    api
      .get(`/truck/${this.props.truckId}/routes`, {})
      .then((res) => {
        this.setState({ routeData: res.data });
      })
      .catch((err) => {
        console.log(err.toString());
      });
  }

  private toggleActive(routeId: number, active: boolean) {
    console.log(`toggle ${routeId} to ${active}`)
    api
      .request({
        url: `/truck/${this.props.truckId}/update-route`,
        method: "PUT",
        data: { routeId: routeId, newActive: active }
      }).then(r => {
        this.setState({
          routeData: this.state.routeData.map(r => r.routeId === routeId? {
            ...r,
            active: active
          } : r)
        });
      }).catch(DEFAULT_ERR_RESP);
  }

  renderRouteRow(index: number) {
    return (
      <RouteListRow
        active={this.state.routeData[index].active}
        routeId={this.state.routeData[index].routeId}
        routeName={this.state.routeData[index].routeName}
        days={this.state.routeData[index].days}
        removeRow={() =>
          this.deleteRow(String(this.state.routeData[index].routeId))
        }
        toggleActive={this.toggleActive}
      />
    );
  }

  render() {
    if (this.state.errorMsg !== undefined)
      return (
        <Container>
          <Typography variant="h2">ERROR</Typography>
          <Typography>{this.state.errorMsg}</Typography>
        </Container>
      );
    else if (this.state.truck === undefined) return <CircularProgress />;

    return (
      <div>
        <CreateRouteDialog
          truckId={(this.props.truckId as unknown) as number}
          onSuccess={this.createSuccess}
          onFailure={this.createFailure}
          open={this.state.createRoute}
        />
        <h1>{this.state.truck.name}</h1>
        <Button color="primary" variant="contained" onClick={this.newRoute}>
          Create Route
        </Button>
        <table>
          <thead>
            <tr>
              <th>Route Name</th>
              <th>Days</th>
              <th>Active</th>
            </tr>
          </thead>

          <tbody>
            {this.state.routeData.map((_, index) => this.renderRouteRow(index))}
          </tbody>
        </table>
      </div>
    );
  }

  private newRoute() {
    this.setState({
      createRoute: true,
    });
  }

  private createSuccess(_form: any, response: any) {
    console.log(response);
    this.setState({
      createRoute: false,
    });
    this.fetchRoutes();
  }

  private createFailure(_form: any, response: any) {
    console.log(response);
    this.setState({
      createRoute: false,
    });
  }
}

export default RouteList;
