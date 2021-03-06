import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { StyledDialogTitle } from "../../util/StyledDialogTitle";
import TruckRouteMapComponent from "..";
import { RouteLocation } from "../../../domain/RouteLocation";
import LocationSearchingIcon from "@material-ui/icons/LocationSearching";
import { Fab } from "@material-ui/core";
import {
  getLocationFromStorage,
  loadUserDefaultLocation,
  saveUserLatLng,
} from "../../../util/position";
import Router from "next/router";

type ChangeLocationProps = {
  hideMap: () => void;
};

const ChangeLocationMap = (props: ChangeLocationProps) => {
  let [location, setLocation] = useState(getLocationFromStorage());

  return (
    <>
      <StyledDialogTitle onClose={props.hideMap}>
        Choose Your Central Location
      </StyledDialogTitle>
      <DialogContent>
        <TruckRouteMapComponent
          locations={[
            {
              stopId: 0,
              coords: location,
            } as RouteLocation,
          ]}
          onDrag={(_, newPos) => setLocation(newPos)}
          onMapClick={(newPos: any) =>
            setLocation({ lat: newPos.latLng.lat(), lng: newPos.latLng.lng() })
          }
          height="50vh"
          allowChangeLocation={false}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            saveUserLatLng(location);
            props.hideMap();
            Router.reload();
          }}
        >
          Save Location
        </Button>
        <Button
          onClick={() => {
            loadUserDefaultLocation(true);
            props.hideMap();
            Router.reload();
          }}
        >
          Reset Location
        </Button>
      </DialogActions>
    </>
  );
};

type ChangeUserLocationProps = {
  showMap: boolean;
  setShowMap: (isOpen: boolean) => void;
};

const ChangeUserLocationButton = (props: ChangeUserLocationProps) => {
  const showMapAction = () => props.setShowMap(true);
  const hideMapAction = () => props.setShowMap(false);

  return (
    <>
      <Dialog fullWidth={true} open={props.showMap}>
        {props.showMap && <ChangeLocationMap hideMap={hideMapAction} />}
      </Dialog>
      <Fab
        onClick={showMapAction}
        style={{
          position: "absolute",
          bottom: "2%",
          right: "2%",
        }}
      >
        <LocationSearchingIcon />
      </Fab>
    </>
  );
};

export default ChangeUserLocationButton;
