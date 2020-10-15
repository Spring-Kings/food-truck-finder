import React from "react";
import Router from "next/router";

import { LatLngLiteral } from "@google/maps";
import { Button, Container } from "@material-ui/core";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api/dist";
import api from "../../../util/api";
import EditRouteStopDialogComponent from "./EditRouteStopDialog";
import {
  RouteStop,
  RoutePointState,
  backendToFrontend,
  frontendToBackend,
} from "./RouteStop";

interface RouteMapProps {
  routeId: number;
}
interface RouteMapState {
  mapCenter: LatLngLiteral;
  routePts: RouteStop[];
  trashedPts: RouteStop[];
  nextStopId: number;

  currentEdit: RouteStop | undefined;
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
    };

    // Bind
    this.addPoint = this.addPoint.bind(this);
    this.editPointLoc = this.editPointLoc.bind(this);
    this.editPointTimes = this.editPointTimes.bind(this);
    this.delete = this.delete.bind(this);
    this.initiateEditPointTimes = this.initiateEditPointTimes.bind(this);
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    // get location
    navigator.geolocation.getCurrentPosition((location) => {
      this.setState({
        mapCenter: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
      });
    });

    // Load route
    api
      .request({
        url: `/truck/route/locations/${this.props.routeId}`,
        method: "GET",
      })
      .then((response) => {
        if (response.data != undefined) {
          var stopId: number = 1;

          // Map backend structure to frontend structure
          this.setState({
            routePts: response.data.map((pt: any) =>
              backendToFrontend(pt, stopId++)
            ),
          });
        }
      })
      .catch((err) => {
        // Temporary measure: kick back to home
        console.log(err);
        Router.replace("/");
      });
  }

  render() {
    var key: string | undefined = process.env.GOOGLE_MAPS_API_KEY;
    return (
      <Container>
        <Button onClick={this.save}>SAVE</Button>
        <EditRouteStopDialogComponent
          key={this.state.currentEdit && this.state.currentEdit.stopId}
          routePt={this.state.currentEdit}
          confirm={this.editPointTimes}
          cancel={() => this.setState({ currentEdit: undefined })}
          delete={this.delete}
        />
        <LoadScript googleMapsApiKey={key as string}>
          <GoogleMap
            mapContainerStyle={{
              height: "100vh",
              width: "100%",
            }}
            zoom={10}
            center={this.state.mapCenter}
            onClick={this.addPoint}
          >
            {this.state.routePts.flatMap((pt) => (
              <Marker
                key={pt.stopId}
                draggable={true}
                position={pt.coords}
                onDragEnd={(e: any) => this.editPointLoc(pt.stopId, e.latLng)}
                onClick={(e) => this.initiateEditPointTimes(pt)}
              />
            ))}
            <Polyline
              path={this.state.routePts
                .filter((pt) => pt.state != RoutePointState.DELETED)
                .flatMap((pt) => pt.coords)}
            />
          </GoogleMap>
        </LoadScript>
      </Container>
    );
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
        state: RoutePointState.CREATED,
      }),
      nextStopId: id + 1,
    });
  }

  private editPointLoc(stopId: number, newPos: LatLngLiteral) {
    this.setState({
      routePts: this.state.routePts.map((pt) => {
        if (pt.stopId == stopId)
          return {
            ...pt,
            stopId: stopId,
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

  private initiateEditPointTimes(pt: RouteStop) {
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
    var result: RouteStop[];
    var trash: RouteStop[] = this.state.trashedPts;

    // If the point is in the DB, save it for deletion
    if (curr.state != RoutePointState.CREATED) trash = trash.concat(curr);

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
    // Update in backend
    if (this.state.routePts.length !== 0)
      await api
        .request({
          url: `/truck/route/locations/${this.props.routeId}`,
          data: this.mapMultipleFrontendToBackend(this.state.routePts),
          method: "POST",
        })
        .catch((err) => console.log(err));

    // Delete in backend
    if (this.state.trashedPts.length !== 0)
      await api
        .request({
          url: `/truck/route/locations/${this.props.routeId}`,
          data: this.mapMultipleFrontendToBackend(this.state.trashedPts),
          method: "DELETE",
        })
        .catch((err) => console.log(err));
  }

  private mapMultipleFrontendToBackend(rp: RouteStop[]) {
    return rp.flatMap((pt) => frontendToBackend(pt, this.props.routeId));
  }
}

export default RouteMapComponent;
