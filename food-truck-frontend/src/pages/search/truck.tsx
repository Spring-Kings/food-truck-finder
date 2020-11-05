import React from 'react';
import {Button, Divider, FormGroup, Grid, List, ListItem, TextField} from "@material-ui/core";
import api from "../../util/api";
import SearchTruckRow from "../../components/search/SearchRow";
import jssPluginPropsSort from "jss-plugin-props-sort";

const truck = [{
    id: -1,
    name: "",
    description: ""
}]

type TruckData ={
    id: number,
    name: string,
    description: string
}

type SearchTruckState = {
    search: string,
    trucks: {
            id: number,
            name: string,
            description: string
        }[]
}

type SearchTruckProps = {

}

class SearchTruckPage extends React.Component<SearchTruckProps, SearchTruckState>{

    constructor(props: SearchTruckProps) {
        super(props);

        this.state = {
            search: "",
            trucks: truck
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.sortSearchTruck = this.sortSearchTruck.bind(this);

    }


    handleSubmit(){
        api.get(`/truck/search?search=${this.state.search}`).then(event => {
                this.setState({trucks: event.data});
        }).catch();
    }

    sortSearchTruck(a: TruckData, b: TruckData){
        var aa = 0, bb = 0;

        if(a.name != null && a.name.toLowerCase().includes(this.state.search)){
            aa += 2;
        }
        if(b.name != null && b.name.toLowerCase().includes(this.state.search)){
            bb += 2;
        }
        if(a.description != null && a.description.toLowerCase().includes(this.state.search)){
            aa += 1;
        }
        if(b.description != null && b.description.toLowerCase().includes(this.state.search)){
            bb += 1;
        }

        return bb - aa;
    }

    render() {

        return (
            <div>
                <FormGroup row>
                    <Grid container spacing={2}>
                        <Grid item xs={10}>
                            <TextField fullWidth label="Search" variant="outlined" onChange={(event) => {
                                this.setState({search: event.target.value.toLowerCase()})
                            }} onKeyDown={event => {
                                if(event.key === 'Enter'){
                                    this.handleSubmit();
                                }
                            }}/>
                        </Grid>
                        <Grid item xs>
                            <Button variant="contained" onClick={this.handleSubmit}>Search</Button>
                        </Grid>
                    </Grid>
                </FormGroup>
                <List>
                    {this.state.trucks.sort(this.sortSearchTruck).map(value => (
                        <SearchTruckRow truck={value}/>
                    ))}
                </List>
                <p>{JSON.stringify(this.state.trucks)}</p>
            </div>
        )
    }
}

export default SearchTruckPage;