import React from 'react';
import {Box, Container, GridList, GridListTile, List, ListItem, Typography} from "@material-ui/core";
import TruckCardComponent from "./TruckCardComponent";
import TruckLocationMapComponent from "../map/truck_location_map/TruckLocationMapComponent";
import {RouteLocation} from "../map/route-map/RouteLocation";
import {SimpleTruck} from "../../redux/user/UserReducer";

interface Props {
  routePts: RouteLocation[];
  trucks?: SimpleTruck[];
  owner?: boolean;
  listLabel: string;
  mapLabel: string;
}

function TruckListAndMapComponent(props: Props) {
  return (
    <GridList cols={5}
              style={{
                height: "100vh",
                width: "100%",
              }}>
      <GridListTile cols={2} style={{ height: '50vh' }}>
        <Box pt={1} px={3}>
          <Typography variant="h6">{props.listLabel}</Typography>
        </Box>
        <Container style={{maxHeight: '50vh', overflow: 'auto'}}>
          <List disablePadding>
            {
              props.trucks?.map(truck => (
                <ListItem key={truck.id} style={{ minWidth: '100%' }} disableGutters>
                  <TruckCardComponent id={truck.id} userOwnsTruck={props.owner ? props.owner : false}/>
                </ListItem>
              ))
            }
          </List>
        </Container>
      </GridListTile>
      <GridListTile cols={3} style={{ height: '50vh' }}>
        <Box py={0.5} px={3}>
          <Typography variant="h6">{props.mapLabel}</Typography>
        </Box>
        <TruckLocationMapComponent locations={props.routePts} height="50vh"/>
      </GridListTile>
    </GridList>
  );
}

export default TruckListAndMapComponent;