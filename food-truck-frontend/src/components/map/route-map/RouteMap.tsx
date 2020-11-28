import React from "react";

import {LatLngLiteral} from "@google/maps";
import {Button, Container} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert'
import EditRouteStopDialogComponent from "./EditRouteStopDialog";
import {locationsConflict, RouteLocation, RouteLocationState} from "./RouteLocation";
import TruckRouteMapComponent from "..";
import {
  deleteRouteLocations,
  loadRouteLocations,
  updateRouteDays,
  updateRouteLocations,
} from "../../../api/RouteLocation";
import {DEFAULT_ERR_KICK, DEFAULT_ERR_RESP, DEFAULT_OK_RESP as DEFAULT_NOOP,} from "../../../api/DefaultResponses";
import RouteDaysBar from "./RouteDaysBar";
import DayOfWeek from "./DayOfWeek";
import {toTimeString} from "../../../util/date-conversions";
import api from "../../../util/api";

enum Status {
  OK, PLEASE_WAIT, CONFLICT, BAD_ROUTE
}

interface RouteMapProps {
  routeId: number;
}
interface RouteMapState {
  mapCenter: LatLngLiteral;
  routePts: RouteLocation[];
  trashedPts: RouteLocation[];
  nextStopId: number;
  days: DayOfWeek[];
  trashedDays: DayOfWeek[];
  currentEdit: RouteLocation | undefined;
  status: Status;
  errorMessage: string | null;
}

class RouteMapComponent extends React.Component<RouteMapProps, RouteMapState> {
  constructor(props: RouteMapProps) {
    super(props);

    this.state = {
      mapCenter: {
        lat: 0,
        lng: 0,
      },
      routePts: [],
      trashedPts: [],
      nextStopId: 1,
      currentEdit: undefined,
      days: [],
      trashedDays: [],
      status: Status.PLEASE_WAIT,
      errorMessage: null,
    };

    // Bind
    this.addPoint = this.addPoint.bind(this);
    this.editPointLoc = this.editPointLoc.bind(this);
    this.editPointTimes = this.editPointTimes.bind(this);
    this.delete = this.delete.bind(this);
    this.initiateEditPointTimes = this.initiateEditPointTimes.bind(this);
    this.save = this.save.bind(this);
    this.saveDays = this.saveDays.bind(this);
  }

  async componentDidMount() {
    await this.loadRoute();
    api.get(`/route/${this.props.routeId}`)
      .then((resp) => {
        if (resp.data.active === false)
          this.setState({status: Status.OK});
        else
          this.setState({
            status: Status.BAD_ROUTE,
            errorMessage: "Only non-active routes can be edited."
          });
      })
      .catch(_ => this.setState({
        status: Status.BAD_ROUTE,
        errorMessage: "The route appears to be invalid."
      }));
  }

  saveDays(days: DayOfWeek[], trashedDays: DayOfWeek[]) {
    this.setState({days, trashedDays});
  }

  render() {
    let errorAlert;
    if (this.state.errorMessage)
      errorAlert = <Alert severity="error">{this.state.errorMessage}</Alert>
    else
      errorAlert = null;

    const pleaseWait = (this.state.status == Status.PLEASE_WAIT)
      ? <p>Please wait...</p>
      : null;

    return (
      <Container>
        {errorAlert}
        {pleaseWait}

        <Button disabled={this.state.status != Status.OK} onClick={this.save}>SAVE</Button>
        <RouteDaysBar routeId={this.props.routeId} func={this.saveDays}/>

        <EditRouteStopDialogComponent
          key={this.state.currentEdit && this.state.currentEdit.stopId}
          routePt={this.state.currentEdit}
          confirm={this.editPointTimes}
          cancel={() => this.setState({currentEdit: undefined})}
          delete={this.delete}
        />
        <TruckRouteMapComponent
          locations={this.state.routePts}
          isRoute={true}
          onDrag={this.editPointLoc}
          onMarkerClick={this.initiateEditPointTimes}
          onMapClick={(e: any) => this.addPoint(e)}
        />
      </Container>
    );
  }

  private verify = (): Promise<void> => {
    if (this.state.status == Status.OK || this.state.status == Status.CONFLICT) {
      const errMsg = this.checkForConflicts();
      if (errMsg)
        return new Promise<void>((resolve) =>
          this.setState({errorMessage: errMsg, status: Status.CONFLICT}, resolve)
        );
      else
        return new Promise<void>(resolve =>
          this.setState({errorMessage: null, status: Status.OK}, resolve)
        );
    } else
      return Promise.resolve();
  }

  private checkForConflicts = (): string | null => {
    const locs = this.state.routePts;
    for (let i = 0; i < locs.length; ++i) {
      for (let j = i + 1; j < locs.length; ++j) {
        const loc1 = locs[i];
        const loc2 = locs[j];
        if (locationsConflict(loc1, loc2)) {
          return `Stop #${loc1.stopId} (${toTimeString(loc1.arrivalTime)} - ${toTimeString(loc1.exitTime)})` +
            ` conflicts with stop #${loc2.stopId} (${toTimeString(loc2.arrivalTime)} - ${toTimeString(loc2.exitTime)})`
        }
      }
    }

    return null;
  }

  private loadRoute(): Promise<void> {
    // get location
    let mapCenter: LatLngLiteral = {
      lat: 0,
      lng: 0
    };
    navigator.geolocation.getCurrentPosition((location) => {
      mapCenter = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
    });

    // Load route
    return loadRouteLocations(
      this.props.routeId,
      DEFAULT_ERR_KICK
    ).then(pts => {
      return this.setState({mapCenter, routePts: pts, nextStopId: pts.length + 1}, this.verify);
    });

  }

  private addPoint(e: any) {
    const id: number = this.state.nextStopId;
    const time = new Date();
    time.setUTCSeconds(0, 0);
    const pts = this.state.routePts.concat({
      stopId: id,
      routeLocationId: -1,
      coords: {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      },
      arrivalTime: time,
      exitTime: time,
      state: RouteLocationState.CREATED,
    });

    this.setState({
      routePts: pts,
      nextStopId: id + 1,
    }, this.verify);
  }

  private editPointLoc(edit_pt: RouteLocation, newPos: LatLngLiteral) {
    this.setState({
      routePts: this.state.routePts.map((pt) => {
        if (pt.stopId == edit_pt.stopId)
          return {
            ...pt,
            stopId: edit_pt.stopId,
            coords: newPos,
          };
        else return pt;
      }),
    });
  }

  private editPointTimes(arrival: Date, departure: Date) {
    const pts = this.state.routePts.map((pt) => {
      if (pt.stopId === this.state.currentEdit?.stopId) {
        return {
          ...pt,
          arrivalTime: arrival,
          exitTime: departure,
        };
      } else return pt;
    });

    this.setState({
      routePts: pts,
      currentEdit: undefined,
    }, this.verify);
  }

  private initiateEditPointTimes(pt: RouteLocation, _: LatLngLiteral) {
    this.setState({
      currentEdit: pt,
    });
  }

  private delete() {
    // If there is no route stop under edit, then abort
    const curr = this.state.currentEdit;
    if (curr == undefined) return;

    // Remove the route stop and re-index
    let id: number = 1;
    let result: RouteLocation[];
    let trash: RouteLocation[] = this.state.trashedPts;

    // If the point is in the DB, save it for deletion
    if (curr.state != RouteLocationState.CREATED) trash = trash.concat(curr);

    // Remove from the results array
    result = this.state.routePts
      .filter((pt) => pt.stopId != curr.stopId)
      .map((pt) => ({
        ...pt,
        stopId: id++,
      }));

    // Update route
    this.setState({
      currentEdit: undefined,
      routePts: result,
      trashedPts: trash,
      nextStopId: id,
    }, this.verify);
  }

  private async save() {
    this.setState({status: Status.PLEASE_WAIT});

    // Update in backend
    await updateRouteDays(this.props.routeId, this.state.days, this.state.trashedDays);

    if (this.state.routePts.length !== 0)
      await updateRouteLocations(
        this.props.routeId,
        this.state.routePts,
        DEFAULT_NOOP,
        DEFAULT_ERR_RESP
      );

    // Delete in backend
    if (this.state.trashedPts.length !== 0)
      await deleteRouteLocations(
        this.props.routeId,
        this.state.trashedPts,
        DEFAULT_NOOP,
        DEFAULT_ERR_RESP
      );

    // Reload from backend
    await this.loadRoute();
    this.setState({status: Status.OK}, this.verify);
  }
}

export default RouteMapComponent;
