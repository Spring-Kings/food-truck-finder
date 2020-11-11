import api from "../../../util/api";
import Form from "../../../components/Form";
import {TruckProps, TruckState, userCanEditTruck} from "../../../components/TruckView";
import NotFound from "../../../components/NotFound";
import React, {Component} from 'react'
import {AxiosResponse} from "axios";
import Router, {useRouter} from "next/router";
import {Button, CircularProgress, TextField, Typography} from "@material-ui/core";
import MultiField from "../../../components/util/multi_field";

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
            description: "",
            priceRating: -1,
            message: "",
            tags: []
        };

    }

  render() {
    if (this.state.userId == -1)
      return <CircularProgress/>
      
    return (
        <>
            <Typography variant={'h4'}>Edit Truck ID: {this.state.id}</Typography>
            <Form submitMethod="PUT" submitUrl={'/truck/update'} onSuccessfulSubmit={this.onSubmit}
                  onFailedSubmit={this.onFail}>
                <TextField className={"hidden"} disabled label="Truck ID" name="truckId" defaultValue={this.state.id}/>

                <TextField label="Truck Name" variant="outlined" name="name" defaultValue={this.state.name}/>
                <TextField label="Description" variant="outlined" name="description"
                           defaultValue={this.state.description}/>
                <TextField label="Price Rating" variant="outlined" name="priceRating"
                           defaultValue={this.state.priceRating}/>
                <MultiField
                  title="Truck Tags"
                  name="tags"
                  variant="h4"
                  value={this.state.tags}
                />
            </Form>

            <Typography variant={'h4'}>Upload Menu</Typography>
            <form encType="multipart/form-data">
                <Button variant="contained" component="label">Upload Menu
                    <input className="hidden" type="file" id="fileInput" name="file" onChange={this.onMenuChange}/>
                </Button>
            </form>

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

    onMenuChange = (event: React.FormEvent) => {
        var formData = new FormData();
        var imagefile = document.querySelector('#fileInput') as HTMLInputElement;

        if (imagefile === null || imagefile.files === null || imagefile.files[0] == null) {
            console.log("Don't see a file there mate");
            return;
        }

        formData.append("file", imagefile.files[0]);
        api.post(`/truck/${this.state.id}/upload-menu`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(_ => this.setState({message: "Successfully uploaded menu"}))
            .catch(err => this.setState({message: "Failed to upload menu"}));
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