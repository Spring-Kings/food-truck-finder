import React from "react";

import google from "@google/maps";
import { Container } from "@material-ui/core";

interface MapProps {}
interface MapState {
  coordinates: number[] | undefined;
}

class GoogleMapComponent extends React.Component<MapProps, MapState> {
  private map: google.maps.Map;

  constructor(props: MapProps) {
    super(props);
  }

  componentDidMount() {
    // Request permission to

    if (this.state.coordinates != undefined) {
      this.map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          zoom: 7,
          center: { lat: 41.879, lng: -87.624 }, // Center the map on Chicago, USA.
        }
      );
    }
  }

  render() {
    return (
      <Container>
        {this.state.coordinates == undefined ? this.requestPermissionDialog() : null}
        <script
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&callback=initMap`}
        ></script>
      </Container>
    );
  }

  requestPermissionDialog() {
      if (sessionStorage)
  }
}
