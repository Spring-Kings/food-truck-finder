import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography} from "@material-ui/core";
import Router from "next/router";
import React, {useState} from "react";
import TruckRouteMapComponent from "..";
import {DEFAULT_ERR_RESP} from "../../../api/DefaultResponses";
import {getTruckById} from "../../../api/Truck";
import {MoneyRating} from "../../truck/rate_and_review/ratings";
import {blankRouteLocation, RouteLocation} from "../route-map/RouteLocation";

export type TruckLocationMapProps = {
  locations: RouteLocation[]
}

const TruckLocationMapComponent = (props: TruckLocationMapProps) => {
  const [viewTruck, setViewTruck]: [RouteLocation | undefined, any] = useState(blankRouteLocation());

  const selectTruck = async (pt: RouteLocation, _latLng: any) => setViewTruck((await getTruckById(pt.stopId, DEFAULT_ERR_RESP)));
  const viewSelectedTruck = () => {
      if (viewTruck !== undefined) Router.replace(`/truck/${viewTruck.id}`);
    };
  const cancelSelectedView = () => setViewTruck(undefined);

  return (
    <>
      {/* Dialog to show truck when clicked on */}
      <Dialog open={viewTruck !== undefined && viewTruck.id > 0}>
        <DialogTitle>
          {viewTruck?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {viewTruck?.description}
          </Typography>
          <Grid container>
            <Grid>
              {viewTruck && viewTruck.priceRating ? <MoneyRating readOnly disabled value={viewTruck.priceRating}/> :
                <Typography variant="body1">Unrated</Typography>}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={viewSelectedTruck}>View</Button>
          <Button onClick={cancelSelectedView}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Actual map */}
      <TruckRouteMapComponent {...props} onMarkerClick={selectTruck} isRoute={false} />
    </>
  );
};

export default TruckLocationMapComponent;
