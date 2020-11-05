import React from 'react';
import {Divider, ListItem, ListItemText} from "@material-ui/core";
import {useRouter} from "next/router";

type TruckProp = {
    truck : {
        id: number,
        name: string,
        description: string
    }
}

function SearchTruckRow(truck: TruckProp){
    const router = useRouter();

    if(truck.truck.id == -1){
        return(
            <div>

            </div>
        )
    }

    return(
        <div>
            <Divider/>
            <ListItem button onClick={() => {router.push(`/truck/${truck.truck.id}`)}}>
                <ListItemText primary={truck.truck.name}/>
                <ListItemText secondary={truck.truck.description ? truck.truck.description : "No Description"}/>
            </ListItem>
        </div>
    )
}

export default SearchTruckRow;