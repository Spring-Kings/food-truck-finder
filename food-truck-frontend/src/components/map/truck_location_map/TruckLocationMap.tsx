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

interface MapProps {}
interface MapState {
  coordinates: LatLngLiteral;
}

export class GoogleMapComponent extends React.Component<MapProps, MapState> {
  constructor(props: MapProps) {
    super(props);

    this.state = {
      coordinates: {
        lat: 0.0,
        lng: 0.0,
      },
    };

    this.accept = this.accept.bind(this);
  }

  componentDidMount() {
    console.log("we be here lads");
  }

  render() {
    var key: string | undefined = process.env.GOOGLE_MAPS_API_KEY;
    return (
      <Container>
        <LoadScript googleMapsApiKey={key as string}>
          <GoogleMap
            mapContainerStyle={{
              height: "100vh",
              width: "100%"
            }}
            zoom={10}
            center={this.state.coordinates}
          />
        </LoadScript>
      </Container>
    );
  }

  private requestPermissionDialog() {
    return (
      <Dialog open={this.state.coordinates !== undefined}>
        <DialogTitle>Share Location</DialogTitle>
        <DialogContent>
          May we use your current location to show you food trucks in your area?
        </DialogContent>
        <DialogActions>
          <Button onClick={this.accept}>AGREE</Button>
          <Button>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }

  private accept() {
    navigator.geolocation.getCurrentPosition((location) => {
      this.setState({
        coordinates: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
      });
    });
  }
}
