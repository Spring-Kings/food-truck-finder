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
import { GoogleMap, LoadScript } from "@react-google-maps/api/dist";

interface RouteStop {
    coords: LatLngLiteral;
    arrival: any;
}

interface RouteMapProps {}
interface RouteMapState {
  mapCenter: LatLngLiteral;
  routePts: RouteStop
}

class RouteMapComponent extends React.Component<RouteMapProps, RouteMapState> {
  constructor(props: RouteMapProps) {
    super(props);

    this.state = {
      mapCenter: {
        lat: 0,
        lng: 0,
      },
    };
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
          />
        </LoadScript>
      </Container>
    );
  }

  private addMarker(e: any) {
      console.log(e);
  }
}

export default RouteMapComponent;