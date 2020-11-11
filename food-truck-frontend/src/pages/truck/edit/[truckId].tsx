import api from "../../../util/api";
import Form from "../../../components/Form";
import {TruckProps, TruckState, userCanEditTruck} from "../../../components/TruckView";
import NotFound from "../../../components/NotFound";
import React, {Component} from 'react'
import {AxiosResponse} from "axios";
import Router, {useRouter} from "next/router";
import {Button, CircularProgress, TextField, Typography} from "@material-ui/core";
import FormData from 'form-data'

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
        };

        this.uploadMenuHandler = this.uploadMenuHandler.bind(this);
    }

  render() {
    if (this.state.userId == -1)
      return <CircularProgress/>
      
    return (
        <>
            <Typography variant={'h4'}>Edit Truck ID: {this.state.id}</Typography>
            <Form submitMethod="PUT" submitUrl={'/truck/update'} onSuccessfulSubmit={this.onSubmit}
                  onFailedSubmit={this.onFail}>
                <TextField disabled label="Truck ID" variant="outlined" name="truckId" defaultValue={this.state.id}/>
                <TextField label="Truck Name" variant="outlined" name="name" defaultValue={this.state.name}/>
                <TextField label="Description" variant="outlined" name="description"
                           defaultValue={this.state.description}/>
                <TextField label="Price Rating" variant="outlined" name="priceRating"
                           defaultValue={this.state.priceRating}/>
                <TextField label="Food Category" variant="outlined" name="foodCategory"
                           defaultValue={this.state.foodCategory}/>
                <TextField label="Text Menu" variant="outlined" name="textMenu" defaultValue={this.state.textMenu}/>
            </Form>

            <Typography variant={'h4'}>Upload Menu</Typography>
            <Form submitUrl="" customSubmitHandler={this.uploadMenuHandler}
                  formProps={{encType: "multipart/form-data"}}>
                <input id={"fileInput"} accept="image/*" type="file" name="file"/>
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

    uploadMenuHandler(event: React.FormEvent, formData: any) {
        const data = new FormData();
        const file: HTMLInputElement = document.querySelector('#fileInput') as HTMLInputElement;
        if (file === null || file.files === null || file.files[0] === null) {
            console.log("Don't see a file there mate");
            return;
        }

        data.append('file', file.files[0]);
        api.request({
            url: `/truck/${this.state.id}/upload-menu`,
            data: formData,
            method: "POST",
            headers: {
                ...data.getHeaders(),
                "Content-Length": data.getLengthSync()
            }
        })
            .then(response => {
                console.log("Yeet");
            })
            .catch(error => {
                if (error.response) {
                    console.log("Got response with error status code");
                } else if (error.request) {
                    console.log("Got no response")
                } else {
                    console.log('Failed to make request', error.message);
                }
            })
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