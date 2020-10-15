import {
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@material-ui/core";
import React from "react";
import api from "../../util/api";
import CreateRouteDialog from "./CreateRouteDialog";

interface RouteListTruck {
  id: string;
  userId: string;
  name: string;
  schedule: string;
};
interface RouteListRouteInfo {
  routeId: number;
  routeName: string;
  active: string;
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
    active: "",
  },
];

type RouteState = {
  truck: RouteListTruck | undefined;
  routeData: [];

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

  renderRouteRow(value: any) {
    return (
      <tr>
        <td>{this.state.routeData[index].routeName}</td>
      </tr>
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
          truckId={this.props.truckId as unknown as number}
          onSuccess={this.createSuccess}
          onFailure={this.createFailure}
          open={this.state.createRoute}
        />
        <h1>{this.state.truck.name}</h1>
        <table>
          <tr>
            <th>Route Name</th>
            <th>Days</th>
            <th>Active</th>
          </tr>

          {this.state.routeData.map((value) =>
            this.renderRouteRow(value)
          )}
        </table>
        <Button color="primary" variant="contained" onClick={this.newRoute}>
          New
        </Button>
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
