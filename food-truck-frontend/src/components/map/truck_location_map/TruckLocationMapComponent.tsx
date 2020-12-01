import {Dialog, DialogContent} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import TruckRouteMapComponent from "..";
import {DEFAULT_ERR_RESP} from "../../../api/DefaultResponses";
import {getTruckById} from "../../../api/TruckApi";
import {RouteLocation} from "../../../domain/RouteLocation";
import TruckCardComponent from "../../truck/TruckCardComponent";
import {userCanEditTruck} from "../../TruckView";
import {StyledDialogTitle} from "../../util/StyledDialogTitle";
import Truck, {emptyTruck} from "../../../domain/Truck";

export type TruckLocationMapProps = {
  locations: RouteLocation[];
  height?: string;
}

const TruckLocationMapComponent = (props: TruckLocationMapProps) => {
  const [viewTruck, setViewTruck]: [Truck | undefined, any] = useState(emptyTruck());
  const [ownsTruck, setOwnsTruck]: [boolean, any] = useState(false);

  const selectTruck = async (pt: RouteLocation, _latLng: any) => setViewTruck((await getTruckById(pt.stopId, DEFAULT_ERR_RESP)));
  const cancelSelectedView = () => setViewTruck(undefined);

  useEffect(() => {
    if (viewTruck)
      setOwnsTruck(userCanEditTruck(viewTruck.id as number));
  }, [viewTruck]);

  return (
    <>
      {/* Dialog to show truck when clicked on */}
      <Dialog open={viewTruck !== undefined && viewTruck.id > 0}>
        <StyledDialogTitle onClose={cancelSelectedView}>
          Truck Info
        </StyledDialogTitle>
        <DialogContent>
          {viewTruck?.id !== undefined &&
            <TruckCardComponent id={viewTruck.id as number} userOwnsTruck={ownsTruck}/>
          }
        </DialogContent>
      </Dialog>

      {/* Actual map */}
      <TruckRouteMapComponent {...props} onMarkerClick={selectTruck} isRoute={false} height={props.height}/>
    </>
  );
};

export default TruckLocationMapComponent;
