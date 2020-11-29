import React from 'react';
import {Button, Container, FormGroup, Grid, List, TextField} from "@material-ui/core";
import SearchTruckRow from "../../components/search/SearchRow";
import {searchTruckByName} from "../../api/TruckApi";
import Truck from "../../domain/Truck";

type SearchTruckState = SearchTruckProps & {
  search: string;
  trucks: Truck[];
}

type SearchTruckProps = {
  onRedirect?: () => void;
}

class SearchTruckComponent extends React.Component<SearchTruckProps, SearchTruckState> {
  constructor(props: SearchTruckProps) {
    super(props);

    this.state = {
      search: "",
      trucks: [],
      onRedirect: props.onRedirect,
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    searchTruckByName(this.state.search, (_err) => {
      this.setState({trucks: []});
    }).then(trucks => {
      if (trucks != null)
        this.setState({trucks})
    });
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
                if (event.key === 'Enter') {
                  this.handleSubmit();
                }
              }}/>
            </Grid>
            <Grid item>
              <Button onClick={this.handleSubmit}>Search</Button>
            </Grid>
          </Grid>
        </FormGroup>
        <Container style={{maxHeight: '50vh', overflow: 'auto'}}>
          <List >
            <List disablePadding>
              {this.state.trucks.map(truck => (
                <SearchTruckRow key={truck.id} truck={truck} onRedirect={this.state.onRedirect}/>
              ))}
            </List>
          </List>
        </Container>
      </>
    )
  }
}

export default SearchTruckComponent;