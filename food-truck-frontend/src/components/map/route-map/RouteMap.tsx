import React from "react";

import { LatLng, LatLngArray, LatLngLiteral } from "@google/maps";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api/dist";
import api from "../../../util/api";

interface RouteStop {
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
    };

    // Bind
    this.addMarker = this.addMarker.bind(this);
    this.updatePoint = this.updatePoint.bind(this);
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
        <LoadScript googleMapsApiKey={key as string}>
          <GoogleMap
            mapContainerStyle={{
              height: "100vh",
              width: "100%",
            }}
            zoom={10}
            center={this.state.mapCenter}
            onClick={this.addMarker}
          >
            {this.state.routePts.flatMap((pt) => (
              <Marker
                draggable={true}
                position={pt.coords}
                onDragEnd={(e: any) => this.updatePoint(pt.stopId, e.latLng)}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </Container>
    );
  }

  private addMarker(e: any) {
    console.log(e.latLng);
    this.setState({
      routePts: this.state.routePts.concat({
        stopId: e.pixel.x + e.pixel.y,
        coords: e.latLng,
        arrival: new Date(),
        departure: new Date(),
      }),
    });
  }

  private updatePoint(stopId: number, newPos: LatLngLiteral) {
    this.setState({
      routePts: this.state.routePts.map((pt) =>
        pt.stopId === stopId
          ? pt
          : {
              ...pt,
              latLng: newPos,
            }
      ),
    });
  }
}

export default RouteMapComponent;
