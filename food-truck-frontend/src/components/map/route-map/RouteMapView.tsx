import { Dialog } from 'material-ui';
import React, { useEffect, useState } from 'react';
import TruckRouteMapComponent from '..';
import { loadRouteLocations } from '../../../api/RouteLocation';
import { RouteLocation } from './RouteLocation';
import { RouteState } from './RoutesView';
import { StyledDialogTitle } from '../../util/StyledDialogTitle';
import { DialogContent, Grid, Typography } from '@material-ui/core';
import { toTimeString } from '../../../util/date-conversions';

function RouteMapView(props: RouteState) {
  const [route, setRoute]: [RouteState, any] = useState(props);
  const [selectedLocation, setSelectedLocation]: [RouteLocation | null, any] = useState(null);

  useEffect(() => {
    const onFail = (_res: any) => console.log(`Could not load routes for truck.`);
    (async () => {
      let locations: RouteLocation[] = await loadRouteLocations(props.routeId, onFail);
      setRoute({
        ...route,
        locations: locations,
      });
    })();
  }, [props.routeId]);

  return (
    <>
      {/* <Dialog open={selectedLocation !== null}>
        <StyledDialogTitle onClose={() => setSelectedLocation(null)}>
          Active Time
        </StyledDialogTitle>
        <DialogContent>
          <Typography>{`Arrival Time: ${toTimeString(selectedLocation !== null ? (selectedLocation as RouteLocation).arrivalTime : new Date())}`}</Typography>
        </DialogContent>
      </Dialog> */}
      <Grid container direction="row">
        {route.days.map(day => <Grid item key={day}><Typography>{day}</Typography></Grid>)}
      </Grid>
      <TruckRouteMapComponent
              locations={route.locations !== undefined ? route.locations : []}
              isRoute
              onMarkerClick={(pt: RouteLocation, _) => {
                console.group(pt);
                setSelectedLocation(pt);
              }}
              height="50vh"
            />
    </>
  );
}

export default RouteMapView;