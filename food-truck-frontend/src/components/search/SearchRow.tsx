import React from 'react';
import {Divider, ListItem} from "@material-ui/core";
import TruckCardComponent from "../truck/TruckCardComponent";
import Truck from "../../domain/Truck";


type TruckProp = {
  truck: Truck,
  onRedirect?: () => void;
}

function SearchTruckRow(props: TruckProp) {
  if (props.truck.id == -1) {
    return (
      <></>
    );
  }

  return (
    <>
      <Divider/>
      <ListItem style={{minWidth: '100%'}} disableGutters>
        <TruckCardComponent id={props.truck.id} userOwnsTruck={false} onRedirect={props.onRedirect}/>
      </ListItem>
    </>
  )
}

export default SearchTruckRow;