import React from "react";

import { LatLngLiteral } from "@google/maps";
import { Button, Container } from "@material-ui/core";
import EditRouteStopDialogComponent from "./EditRouteStopDialog";
import { RouteLocation, RouteLocationState } from "./RouteLocation";
import TruckRouteMapComponent from "..";
import {
  deleteRouteLocations,
  loadRouteLocations,
  updateRouteDays,
  updateRouteLocations,
} from "../../../api/RouteLocation";
import {

  DEFAULT_ERR_KICK,
  DEFAULT_ERR_RESP,
  DEFAULT_OK_RESP as DEFAULT_NOOP,
} from "../../../api/DefaultResponses";
import RouteDaysBar from "./RouteDaysBar";
import api from "../../../util/api";
import DayOfWeek from "./DayOfWeek";


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
  canSave: boolean;

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
      canSave: true

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

  componentDidMount() {
    this.loadRoute();
  }

  saveDays(days: DayOfWeek[], trashedDays: DayOfWeek[]){
    this.setState({days, trashedDays});
  }

  render() {
    return (
      <Container>
        <Button disabled={!this.state.canSave} onClick={this.save}>SAVE</Button>
        <RouteDaysBar routeId={this.props.routeId} func={this.saveDays}/>


        <EditRouteStopDialogComponent
          key={this.state.currentEdit && this.state.currentEdit.stopId}
          routePt={this.state.currentEdit}
          confirm={this.editPointTimes}
          cancel={() => this.setState({ currentEdit: undefined })}
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

  private async loadRoute() {
    // get location
    var mapCenter: LatLngLiteral = {
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
    var routePts: RouteLocation[] = await loadRouteLocations(
      this.props.routeId,
      DEFAULT_ERR_KICK
    );
    this.setState({ mapCenter, routePts, nextStopId: routePts.length + 1 });
  }

  private addPoint(e: any) {
    var id: number = this.state.nextStopId;
    this.setState({
      routePts: this.state.routePts.concat({
        stopId: id,
        routeLocationId: -1,
        coords: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        },
        arrivalTime: new Date(),
        exitTime: new Date(),
        state: RouteLocationState.CREATED,
      }),
      nextStopId: id + 1,
    });
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
    this.setState({
      routePts: this.state.routePts.map((pt) => {
        if (pt.stopId === this.state.currentEdit?.stopId) {
          return {
            ...pt,
            arrivalTime: arrival,
            exitTime: departure,
          };
        } else return pt;
      }),
      currentEdit: undefined,
    });
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
    var id: number = 1;
    var result: RouteLocation[];
    var trash: RouteLocation[] = this.state.trashedPts;

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
    });
  }

  private async save() {
    this.setState({canSave: false});

    // Update in backend
    updateRouteDays(this.props.routeId, this.state.days, this.state.trashedDays);

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
    this.setState({canSave: true});
  }
}

export default RouteMapComponent;
