import React, { Component } from 'react'
import {Button, CircularProgress, TextField, Typography} from "@material-ui/core";
import api from "../../../util/api";
import {AxiosResponse} from "axios";
import Router, {useRouter} from "next/router";
import Form from "../../../components/Form";
import NotFound from "../../../components/NotFound";
import {TruckProps, TruckState, userCanEditTruck} from "../../../components/TruckView";

interface EditTruckState {
  message: string;
}

type TruckComponentState = TruckState & EditTruckState;

class EditTruck extends Component<TruckProps, TruckComponentState> {
  constructor(props: TruckProps) {
    super(props);
    this.state = {
      id: this.props.truckId,
      userId: -1,
      name: "",
      description: null,
      priceRating: null,
      foodCategory: null,
      textMenu: null,
      message: "",
    };;
  }

  render() {
    if (this.state.userId == -1)
      return <CircularProgress/>
      
    return (
      <>
        <Typography variant={'h4'}>Edit Truck ID: {this.state.id}</Typography>
        <Form submitMethod="PUT" submitUrl={'/truck/update'} onSuccessfulSubmit={this.onSubmit} onFailedSubmit={this.onFail}>
          <TextField disabled label="Truck ID" variant="outlined" name="truckId" defaultValue={this.state.id}/>
          <TextField label="Truck Name" variant="outlined" name="name" defaultValue={this.state.name}/>
          <TextField label="Description" variant="outlined" name="description" defaultValue={this.state.description}/>
          <TextField label="Price Rating" variant="outlined" name="priceRating" defaultValue={this.state.priceRating}/>
          <TextField label="Food Category" variant="outlined" name="foodCategory" defaultValue={this.state.foodCategory}/>
          <TextField label="Text Menu" variant="outlined" name="textMenu" defaultValue={this.state.textMenu}/>
        </Form>
        <Button variant="outlined"
                color="secondary"
                onClick={this.deleteTruck}>
          Delete Truck
        </Button>
        <br/>
        {this.state.message}
      </>
    );
  }

  componentDidMount() {
    api.get(`/truck/${this.props.truckId}`, {})
      .then(res => {
        // If the response indicates they own the truck, show them. Otherwise, kick out.
        if (res && userCanEditTruck(res.data.userId)) {
          this.setState(res.data);
        } else
          Router.replace("/");
      }).catch(err => {
        // If an error, log to console and kick out
        if (err.response) {
          console.log('Got error response code');
        } else if (err.request) {
          console.log('Did not receive Truck response');
        } else {
          console.log(err);
        }

        // Cancel
        Router.replace("/");
      });
  }

  onSubmit = (formData: any, response: AxiosResponse) => {
    api.post(`/reindex`).catch();
    Router.replace(`/truck/${this.state.id}`);
  }

  onFail = (formData: any, response: AxiosResponse) => {
    this.setState({
      ...this.state,
      message: `Failed to update truck details: ${JSON.stringify(response)}`
    });
  }

  deleteTruck = () => {
    api.delete(`/truck/delete/${this.state.id}`, {})
      .then(res => Router.replace('/'))
      .catch(err => {
        this.setState({
          ...this.state,
          message: `Failed to update truck details: ${JSON.stringify(err)}`
        })
      });

    api.post(`/reindex`).catch();
  }
}

function EditTruckPage() {
  const router = useRouter();
  if (router.query.truckId) {
    let truckId: number = router.query.truckId as unknown as number;
    return (
      <EditTruck truckId={truckId}/>
    );
  }
  return (
    <NotFound/>
  );
}

export default EditTruckPage;