import React from 'react';
import {Button, Divider, FormGroup, Grid, List, ListItem, TextField} from "@material-ui/core";
import api from "../../util/api";
import SearchTruckRow from "../../components/search/SearchRow";

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

    }


    handleSubmit(){
        api.get(`/truck/search?search=${this.state.search}`).then(event => {
                this.setState({trucks: event.data});
        }).catch();
    }

    render() {

        return (
            <div>
                <FormGroup row>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <TextField fullWidth label="Search" onChange={(event) => {
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
                    {this.state.trucks.map(value => (
                        <SearchTruckRow truck={value}/>
                    ))}
                </List>
            </div>
        )
    }
}

export default SearchTruckPage;