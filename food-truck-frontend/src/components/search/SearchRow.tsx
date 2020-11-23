import React from 'react';
import {Divider, ListItem, ListItemText} from "@material-ui/core";
import {useRouter} from "next/router";

export type SearchTruckData = {
  id: number;
  name: string;
  description: string;
}

type TruckProp = {
  truck: SearchTruckData,
  onRedirect?: () => void;
}

function SearchTruckRow(props: TruckProp) {
  const router = useRouter();

  if (props.truck.id == -1) {
    return (
      <></>
    );
  }

  return (
    <>
      <Divider/>
      <ListItem button onClick={() => {
        if (props.onRedirect) {
          props.onRedirect();
        }
        router.push(`/truck/${props.truck.id}`);
      }}>
        <ListItemText primary={props.truck.name}/>
        <ListItemText secondary={props.truck.description ? props.truck.description : "No Description"}/>
      </ListItem>
    </>
  )
}

export default SearchTruckRow;