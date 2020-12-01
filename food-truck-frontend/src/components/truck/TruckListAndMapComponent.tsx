import React from 'react';
import {Box, Container, GridList, GridListTile, List, ListItem, Typography} from "@material-ui/core";
import TruckCardComponent from "./TruckCardComponent";
import TruckLocationMapComponent from "../map/truck_location_map/TruckLocationMapComponent";
import {RouteLocation} from "../../domain/RouteLocation";
import {RecommendedSimpleTruck, SimpleTruck} from "../../redux/user/UserReducer";

interface Props {
  routePts: RouteLocation[];
  trucks?: SimpleTruck[];
  recommendedTrucks?: RecommendedSimpleTruck[];
  owner?: boolean;
  listLabel: string;
  mapLabel: string;
}

function TruckListAndMapComponent(props: Props) {
  return (
    <GridList cols={5}
              style={{
                height: "auto",
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
                  <TruckCardComponent id={truck.id} userOwnsTruck={props.owner !== undefined ? props.owner : false}/>
                </ListItem>
              ))
            }
          </List>
        </Container>
      </GridListTile>
      <GridListTile cols={3} style={{ height: 'auto' }}>
        <Box py={0.5} px={3}>
          <Typography variant="h6">{props.mapLabel}</Typography>
        </Box>
        <TruckLocationMapComponent locations={props.routePts} height="50vh"/>
      </GridListTile>

      { props.recommendedTrucks !== undefined ?
        <GridListTile cols={2} style={{height: '50vh'}}>
          <Box pt={1} px={3}>
            <Typography variant="h6">Recommended</Typography>
          </Box>
          <Container style={{maxHeight: '50vh', overflow: 'auto'}}>
            <List disablePadding>
            {
              props.recommendedTrucks.map(truck => (
                <ListItem key={truck.truck.id} style={{minWidth: '100%'}} disableGutters>
                  <TruckCardComponent id={truck.truck.id}
                    userOwnsTruck={false}/>
                </ListItem>
              ))
            }
            </List>
          </Container>
        </GridListTile>
        : null }
    </GridList>

  );
}

export default TruckListAndMapComponent;