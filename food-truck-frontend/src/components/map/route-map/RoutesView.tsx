import Route from './Route';
import React, { useEffect, useState } from 'react';
import { loadRoutes } from '../../../api/RouteLocation';
import { RouteLocation } from './RouteLocation';
import RouteMapView from './RouteMapView';
import { Container, List, ListItem, Typography } from '@material-ui/core';

interface Props {
  truckId: number;
};

export type RouteState = Route & {
  locations?: RouteLocation[];
};

function RoutesView(props: Props) {
  const [routes, setRoutes]: [RouteState[], any] = useState([]);
  const [selectedRoute, setSelectedRoute]: [RouteState | null, any] = useState(null);

  useEffect(() => {
    const onFail = (_res: any) => console.log(`Could not load routes for truck.`); 
    (async () => setRoutes(await loadRoutes(props.truckId, onFail)))();
  }, [props.truckId]);

  useEffect(() => {
    if (routes.length > 0) {
      setSelectedRoute(routes[0]);
    }
  }, [routes]);
  
  return (
    <>
      <Container style={{maxHeight: '50vh', overflow: 'auto'}}>
        <Typography>Active Routes</Typography>
        <List disablePadding>
            {
              routes.map(route => (
                <ListItem key={`${route.routeId}-view`}
                  style={{ minWidth: '100%' }}
                  button
                  onClick={() => setSelectedRoute(route)}
                  disableGutters>
                  <Typography>{route.routeName}</Typography>
                </ListItem>
              ))
            }
        </List>
      </Container>
      {selectedRoute !== null && <RouteMapView {...selectedRoute}/>}
    </>
  );
}

export default RoutesView;