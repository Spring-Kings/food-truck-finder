import React from 'react';
import {Button, FormGroup, Grid, List, TextField} from "@material-ui/core";
import api from "../../util/api";
import SearchTruckRow, {SearchTruckData} from "../../components/search/SearchRow";

const truck = [{
  id: -1,
  name: "",
  description: ""
}]

type SearchTruckState = SearchTruckProps & {
  search: string;
  trucks: SearchTruckData[];
}

type SearchTruckProps = {
  onRedirect?: () => void;
}

class SearchTruckComponent extends React.Component<SearchTruckProps, SearchTruckState>{
  constructor(props: SearchTruckProps) {
    super(props);

    this.state = {
      search: "",
      trucks: truck,
      onRedirect: props.onRedirect,
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
      <>
        <FormGroup row>
          <Grid container direction="row">
            <Grid item xs={10}>
              <TextField fullWidth label="Search" onChange={(event) => {
                this.setState({search: event.target.value.toLowerCase()})
              }} onKeyDown={event => {
                if(event.key === 'Enter'){
                  this.handleSubmit();
                }
              }}/>
            </Grid>
            <Grid item>
              <Button onClick={this.handleSubmit}>Search</Button>
            </Grid>
          </Grid>
        </FormGroup>
        <List>
          {this.state.trucks.map(value => (
            <SearchTruckRow truck={value} onRedirect={this.state.onRedirect}/>
          ))}
        </List>
      </>
    )
  }
}

export default SearchTruckComponent;