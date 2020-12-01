import Route from './Route';
import React, { useEffect, useState } from 'react';
import { loadRoutes } from '../../../api/RouteLocation';
import { RouteLocation } from './RouteLocation';
import RouteMapView from './RouteMapView';
import { Box, Card, CardContent, CardHeader, Container, Grid, GridList, GridListTile, List, ListItem, ListSubheader, Typography } from '@material-ui/core';

interface Props {
  truckId: number;
};

export type RouteState = Route & {
  locations: RouteLocation[];
};

function RoutesView(props: Props) {
  const [routes, setRoutes]: [RouteState[], any] = useState([]);
  const [selectedRoute, setSelectedRoute]: [RouteState | null, any] = useState(null);

  useEffect(() => {
    const onFail = (_res: any) => console.log(`Could not load routes for truck.`); 
    (async () => setRoutes(await loadRoutes(props.truckId, onFail)))();
  }, [props.truckId]);

  useEffect(() => {
    console.group(routes);
    if (routes.length > 0) {
      setSelectedRoute(routes[0]);
    }
  }, [routes]);

  return (
    <GridList cols={10}
    style={{
      height: "50vh",
      width: "100%",
    }}>
      <GridListTile cols={3} style={{ height: '50vh' }}>
        <Card>
          <CardHeader title="Active Routes"/>
          <CardContent>
            <Container style={{maxHeight: '50vh', overflow: 'auto'}}>
              <List disablePadding>
                {
                  routes.filter(route => route.active).map(route => (
                    <ListItem key={`${route.routeId}-view`}
                              style={{ minWidth: '100%' }}
                              button
                              onClick={() => setSelectedRoute(route)}
                              disableGutters>
                      <Box pl={1}>
                        <Typography>{route.routeName}</Typography>
                      </Box>
                    </ListItem>
                  ))
                }
              </List>
            </Container>
          </CardContent>
        </Card>
        <Box py={1}></Box>
        <Card>
          <CardHeader title="Active Days"/>
          <CardContent>
            <Grid container direction="row">
              {selectedRoute !== null && (selectedRoute as RouteState).days.map(day => (
                <Box p={2}>
                  <Grid item key={day}><Typography>{day}</Typography></Grid>
                </Box>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </GridListTile>
      {selectedRoute !== null && 
      <GridListTile cols={7} style={{ height: '50vh' }}>
        <RouteMapView {...selectedRoute}/>
      </GridListTile>
      }
    </GridList>
  );
}

export default RoutesView;