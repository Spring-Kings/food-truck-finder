import React from "react";

import { LatLng, LatLngArray, LatLngLiteral } from "@google/maps";
import { Container } from "@material-ui/core";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api/dist";
import { RouteStop } from "../route-map/RouteStop";

interface MapMouseEvent {
  latLng: LatLng;
}

interface MapProps {
  routePts: RouteStop[];
  onDrag?: (pt: RouteStop, e: MapMouseEvent) => void;
  onMarkerClick?: (pt: RouteStop, e: MapMouseEvent) => void;
  onMapClick?: (e: MapMouseEvent) => void;
}
interface MapState {
  coordinates: LatLngLiteral;
}

export class TruckRouteMapComponent extends React.Component<MapProps, MapState> {
  constructor(props: MapProps) {
    super(props);

    this.state = {
      coordinates: {
        lat: 0,
        lng: 0,
      },
    };
    this.trigger = this.trigger.bind(this);
  }

  componentDidMount() {
    // get location
    navigator.geolocation.getCurrentPosition((location) => {
      this.setState({
        coordinates: {
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
            center={this.state.coordinates}
            onClick={(e) => {
              if (this.props.onMapClick) this.props.onMapClick(e);
            }}
          >
            {this.props.routePts.flatMap((pt) => (
              <Marker
                key={pt.stopId}
                draggable={this.props.onDrag !== undefined}
                position={pt.coords}
                onDragEnd={(e) => this.trigger(this.props.onDrag, pt, e)}
                onClick={(e) => this.trigger(this.props.onMarkerClick, pt, e)}
              />
            ))}
            <Polyline path={this.props.routePts.flatMap((pt) => pt.coords)} />
          </GoogleMap>
        </LoadScript>
      </Container>
    );
  }

  private trigger(toTrigger: ((pt: RouteStop, e: any) => any) | undefined, pt: RouteStop, e: any) {
    if (toTrigger) toTrigger(pt, e);
  }
}
