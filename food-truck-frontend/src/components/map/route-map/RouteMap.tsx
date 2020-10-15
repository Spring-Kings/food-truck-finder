import React from "react";

import { LatLng, LatLngArray, LatLngLiteral } from "@google/maps";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api/dist";
import api from "../../../util/api";
import EditRouteStopDialogComponent from "./EditRouteStopDialog";

export interface RouteStop {
  stopId: number;
  coords: LatLngLiteral;
  arrival: Date;
  departure: Date;

  readonly [x: string]: number | LatLngLiteral | Date;
}

interface RouteMapProps {
  routeId: number;
}
interface RouteMapState {
  mapCenter: LatLngLiteral;
  routePts: RouteStop[];
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
      nextStopId: 1,
      currentEdit: undefined,
    };

    // Bind
    this.addPoint = this.addPoint.bind(this);
    this.editPointLoc = this.editPointLoc.bind(this);
    this.editPointTimes = this.editPointTimes.bind(this);
    this.delete = this.delete.bind(this);
    this.initiateEditPointTimes = this.initiateEditPointTimes.bind(this);
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

    // // Load route
    // api.request({
    // })
  }

  render() {
    var key: string | undefined = process.env.GOOGLE_MAPS_API_KEY;
    return (
      <Container>
        <EditRouteStopDialogComponent
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
            <Polyline path={this.state.routePts.flatMap((pt) => pt.coords)} />
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
        coords: e.latLng,
        arrival: new Date(),
        departure: new Date(),
      }),
      nextStopId: id + 1,
    });
  }

  private editPointLoc(stopId: number, newPos: LatLngLiteral) {
    console.log(stopId);
    this.setState({
      routePts: this.state.routePts.map((pt) => {
        console.log(pt.stopId);
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
        if (pt.stopId == this.state.currentEdit?.stopId)
          return {
            ...pt,
            arrival,
            departure,
          };
        else return pt;
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
    var result: RouteStop[] = this.state.routePts
      .filter((pt) => pt.stopId != curr.stopId)
      .map((pt) => ({
        ...pt,
        stopId: id++,
      }));

    // Update route
    this.setState({
        currentEdit: undefined,
        routePts: result,
        nextStopId: id
    })
  }
}

export default RouteMapComponent;
