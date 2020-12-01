import { Dialog } from 'material-ui';
import React, { useEffect, useState } from 'react';
import TruckRouteMapComponent from '..';
import { loadRouteLocations } from '../../../api/RouteLocation';
import { RouteLocation } from './RouteLocation';
import { RouteState } from './RoutesView';
import { StyledDialogTitle } from '../../util/StyledDialogTitle';
import { Grid, Typography } from '@material-ui/core';

function RouteMapView(props: RouteState) {
  const [route, setRoute]: [RouteState, any] = useState(props);
  const [showTime, setShowTime]: [boolean, any] = useState(false);

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
      <Dialog open={showTime}>
        <StyledDialogTitle onClose={() => setShowTime(false)}>
          Active Time
        </StyledDialogTitle>
      </Dialog>
      <Grid container direction="row">
        {route.days.map(day => <Grid item><Typography>{day}</Typography></Grid>)}
      </Grid>
      <TruckRouteMapComponent
              locations={route.locations ? route.locations : []}
              isRoute={true}
              onMarkerClick={() => setShowTime(true)}
              height="50vh"
            />
    </>
  );
}

export default RouteMapView;