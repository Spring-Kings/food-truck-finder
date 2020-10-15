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
}

interface RouteMapProps {
  routeId: number;
}
interface RouteMapState {
  mapCenter: LatLngLiteral;
  routePts: RouteStop[];

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
      currentEdit: undefined,
    };

    // Bind
    this.addPoint = this.addPoint.bind(this);
    this.editPointLoc = this.editPointLoc.bind(this);
    this.editPointTimes = this.editPointTimes.bind(this);
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
    this.setState({
      routePts: this.state.routePts.concat({
        stopId: e.pixel.x + e.pixel.y,
        coords: e.latLng,
        arrival: new Date(),
        departure: new Date(),
      }),
    });
  }

  private editPointLoc(stopId: number, newPos: LatLngLiteral) {
    console.log(stopId);
    this.setState({
      routePts: this.state.routePts.map((pt) => {
        console.log(pt.stopId);
        if (pt.stopId == stopId)
          return {
            stopId: stopId,
            coords: newPos,
            arrival: pt.arrival,
            departure: pt.departure,
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
            stopId: pt.stopId,
            coords: pt.coords,
            arrival,
            departure,
          };
        else return pt;
      }),
      currentEdit: undefined
    });
  }

  private initiateEditPointTimes(pt: RouteStop) {
    this.setState({
      currentEdit: pt,
    });
  }
}

export default RouteMapComponent;
