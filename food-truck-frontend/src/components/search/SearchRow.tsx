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
    return(
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
        // It seems like when changing to the same route
        // with a different URL slug, you need to either
        // reload the page, or redirect to / and then to
        // where you want in .then().
        router.replace(`/truck/${props.truck.id}`)
          .then(() => router.reload());
      }}>
        <ListItemText primary={props.truck.name}/>
        <ListItemText secondary={props.truck.description ? props.truck.description : "No Description"}/>
      </ListItem>
    </>
  )
}

export default SearchTruckRow;