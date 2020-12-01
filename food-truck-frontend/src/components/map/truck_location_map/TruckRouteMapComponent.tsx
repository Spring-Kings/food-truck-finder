import React from "react";

import { LatLngLiteral } from "@google/maps";
import { Container } from "@material-ui/core";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api/dist";
import { RouteLocation } from "../route-map/RouteLocation";
import { getLocationFromStorage } from "../../../util/position";
import ChangeUserLocationButton from "./ChangeUserLocationButton";

interface MapProps {
  locations: RouteLocation[];
  isRoute?: boolean;
  allowChangeLocation?: boolean;
  onDrag?: (pt: RouteLocation, latLng: LatLngLiteral) => void;
  onMarkerClick?: (pt: RouteLocation, latLng: LatLngLiteral) => void;
  onMapClick?: (latLng: LatLngLiteral) => void;
  height?: string;
}

interface MapState {
  coordinates: LatLngLiteral;
  height?: string;
  openChangeLocationDialog: boolean;
}

export class TruckRouteMapComponent extends React.Component<
  MapProps,
  MapState
> {
  constructor(props: MapProps) {
    super(props);

    this.state = {
      coordinates: {
        lat: 0,
        lng: 0,
      },
      height: props.height ? props.height : "100vh",
      openChangeLocationDialog: false,
    };
    this.trigger = this.trigger.bind(this);
  }

  componentDidMount() {
    this.updateLocation();
  }

  render() {
    const key: string | undefined = process.env.GOOGLE_MAPS_API_KEY;
    const changeLocDialog = this.props.allowChangeLocation ? (
      <ChangeUserLocationButton
        showMap={this.state.openChangeLocationDialog}
        setShowMap={this.openCloseLocationDialog}
        updateLocation={this.updateLocation}
      />
    ) : <div/>;

    return (
      <Container fixed>
        {!this.state.openChangeLocationDialog ? (
          <LoadScript googleMapsApiKey={key as string}>
            <GoogleMap
              mapContainerStyle={{
                height: this.state.height,
                width: "100%",
              }}
              zoom={10}
              center={this.state.coordinates}
              onClick={(e) => {
                if (this.props.onMapClick) this.props.onMapClick(e);
              }}
            >
              {this.props.locations.flatMap((pt) => (
                <Marker
                  key={pt.stopId}
                  draggable={this.props.onDrag !== undefined}
                  position={pt.coords}
                  onDragEnd={(e) => this.trigger(this.props.onDrag, pt, e)}
                  onClick={(e) => this.trigger(this.props.onMarkerClick, pt, e)}
                />
              ))}
              {this.props.isRoute && (
                <Polyline
                  path={this.props.locations.flatMap((pt) => pt.coords)}
                />
              )}
              {changeLocDialog}
            </GoogleMap>
          </LoadScript>
        ) : (
          changeLocDialog
        )}
      </Container>
    );
  }

  private trigger(
    toTrigger: ((pt: RouteLocation, e: any) => any) | undefined,
    pt: RouteLocation,
    e: any
  ) {
    if (toTrigger) toTrigger(pt, { lat: e.latLng.lat(), lng: e.latLng.lng() });
  }

  private openCloseLocationDialog = (isOpen: boolean) => {
    this.setState({ openChangeLocationDialog: isOpen });
  };

  private updateLocation = () => this.setState({ coordinates: getLocationFromStorage() });
}
