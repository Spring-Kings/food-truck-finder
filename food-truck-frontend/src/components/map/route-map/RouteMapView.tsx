import React, { useEffect, useState } from 'react';
import TruckRouteMapComponent from '..';
import { loadRouteLocations } from '../../../api/RouteLocation';
import { RouteLocation } from './RouteLocation';
import { RouteState } from './RoutesView';
import { StyledDialogTitle } from '../../util/StyledDialogTitle';
import { Box, Dialog, DialogContent, Grid, Typography } from '@material-ui/core';
import { toTimeString } from '../../../util/date-conversions';

function RouteMapView(props: RouteState) {
  const [route, setRoute]: [RouteState, any] = useState({
    ...props,
    locations: []
  });
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
      <Dialog open={selectedLocation !== null} fullWidth>
        <StyledDialogTitle onClose={() => setSelectedLocation(null)}>
          Active Time
        </StyledDialogTitle>
        <DialogContent>
          <Box p={1}>
            <Typography>{`Arrival Time: ${toTimeString(selectedLocation !== null ? (selectedLocation as RouteLocation).arrivalTime : new Date())}`}</Typography>
            <Typography>{`Exit Time: ${toTimeString(selectedLocation !== null ? (selectedLocation as RouteLocation).exitTime : new Date())}`}</Typography>
          </Box>
        </DialogContent>
      </Dialog>
      <TruckRouteMapComponent
              locations={route.locations}
              isRoute
              onMarkerClick={(pt: RouteLocation, _) => {
                setSelectedLocation(pt);
              }}
              height="50vh"
            />
    </>
  );
}

export default RouteMapView;