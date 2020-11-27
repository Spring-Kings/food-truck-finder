import React from "react";
import {FormControlLabel, Switch, TextField} from "@material-ui/core";

type CreateRowState = {
    days: string[],
    routeName: string,
    active: string
}

type CreateRowProps = {
    truckId: string,
}

class CreateRouteRow extends React.Component<CreateRowProps, CreateRowState>{

    constructor(props: CreateRowProps) {
        super(props);
        this.state = {
            days: [],
            routeName: "",
            active: "Y"
        }
    }

    render() {
        return (
            <div>

                <TextField label={"Route Name"} onChange={event => {this.setState({routeName: event.target.value})}}/>
                <br/>
                <FormControlLabel control={ <Switch checked={this.state.active == "Y"} onChange={event => {
                    if(event.target.checked){
                        this.setState({active: "Y"})
                    }else{
                        this.setState({active: "N"})
                    }
                }}/>} label={"Active"} />

                
            </div>
        );
    }
}

export default CreateRouteRow;