import React, { Component } from 'react'
import {Button, TextField, Typography} from "@material-ui/core";
import api from "../../../util/api";
import {AxiosResponse} from "axios";
import Router, {useRouter} from "next/router";
import Form from "../../../components/Form";
import NotFound from "../../../components/NotFound";

interface EditTruckState {
  id: number;
  userId: number | null;
  name: string;
  description: string | null;
  priceRating: number | null;
  foodCategory: string | null;
  // menu: string | null;
  textMenu: string | null;
  // schedule: string | null;
  message: string;
}

interface EditTruckProps {
  truckId: number;
}

class EditTruck extends Component<EditTruckProps, EditTruckState> {
  constructor(props: EditTruckProps) {
    super(props);
    this.state = {
      id: 0,
      userId: null,
      name: "",
      description: null,
      priceRating: null,
      foodCategory: null,
      textMenu: null,
      message: "",
    };
  }

  render() {
    return (
      <>
        <Typography variant={'h4'}>Edit Truck ID: {this.state.id}</Typography>
        <Form submitMethod="PUT" submitUrl={'/truck/update'} onSuccessfulSubmit={this.onSubmit} onFailedSubmit={this.onFail}>
          <TextField disabled hidden label="Truck ID" variant="outlined" name="truckId" defaultValue={this.state.id}/>
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
      .then(res => this.setState(res ? res.data : null))
      .catch(err => {
        if (err.response) {
          console.log('Got error response code');
        } else if (err.request) {
          console.log('Did not receive Truck response');
        } else {
          console.log(err);
        }
      });
  }

  onSubmit = (formData: any, response: AxiosResponse) => {
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