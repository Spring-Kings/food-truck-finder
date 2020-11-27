import api from "../../../util/api";
import Form from "../../../components/Form";
import {makeEmptyTruckState, TruckProps, TruckState, userCanEditTruck} from "../../../components/TruckView";
import React, {useEffect, useState} from 'react'
import {AxiosError, AxiosResponse} from "axios";
import Router from "next/router";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  TextField,
} from "@material-ui/core";
import MultiField from "../../../components/util/multi_field";
import RouterSelectable from "../../../components/util/RouterSelectableComponent";
import {useFlexGrowStyles} from "../../../components/theme/FoodTruckThemeProvider";
import {getTruckById, deleteTruck} from "../../../api/Truck";

interface EditTruckState {
    message: string;
}

type TruckComponentState = TruckState & EditTruckState;

function EditTruck(props: TruckProps) {
  const classes = useFlexGrowStyles();
  const [state, setState]: [TruckComponentState, any] = useState({
    ...makeEmptyTruckState(),
    id: props.truckId,
    message: "",
  });

  const onMenuChange = (event: React.FormEvent) => {
    const formData = new FormData();
    const imagefile = document.querySelector('#fileInput') as HTMLInputElement;

    if (imagefile === null || imagefile.files === null || imagefile.files[0] == null) {
      console.log("Don't see a file there mate");
      return;
    }

    formData.append("file", imagefile.files[0]);
    api.post(`/truck/${state.id}/upload-menu`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(_ => setState({...state, message: "Successfully uploaded menu"}))
      .catch(err => setState({...state, message: "Failed to upload menu"}));
  }

  useEffect(() => {
    getTruckById(props.truckId, (err) => {
      console.log(`Could not load truck card: ${err}`);
      // Cancel
      Router.replace("/");
    })
      .then(truck => {
        console.table(truck);
        // If the response indicates they own the truck, show them. Otherwise, kick out.
        if (truck && userCanEditTruck(truck.userId))
          setState(truck);
        else
          Router.replace("/");
      });
  }, [props.truckId]);

  const onSubmit = (formData: any, response: AxiosResponse) => {
    Router.replace(`/truck/${state.id}`);
  }

  const onFail = (formData: any, response: AxiosError) => {
    setState({
      ...state,
      message: `Failed to update truck details: ${JSON.stringify(response)}`
    });
  }

  const deleteTruckCallback = () => {
    deleteTruck(state.id, err => {
      setState({
        ...state,
        message: `Failed to update truck details: ${JSON.stringify(err)}`
      })
    })
      .then(res => Router.replace('/'));
  }

  if (state.userId == -1)
    return <CircularProgress/>

  return (
    <Grid container alignItems="stretch">
      <Grid container direction="row" alignItems="flex-start" className={classes.root}>
        <Grid item className={classes.root}>
          <Card>
            <CardHeader title="Edit Truck Details"/>
            <CardContent>
              <Form submitMethod="PUT" submitUrl={'/truck/update'} onSuccessfulSubmit={onSubmit}
                    onFailedSubmit={onFail}>
                <TextField className={"hidden"} disabled label="Truck ID" name="truckId" defaultValue={state.id}/>
                <TextField label="Truck Name" name="name" defaultValue={state.name}/>
                <TextField label="Description" name="description"
                           defaultValue={state.description}/>
                <TextField label="Price Rating" name="priceRating"
                           defaultValue={state.priceRating}/>
                <MultiField
                  title="Truck Tags"
                  name="tags"
                  variant="h6"
                  value={state.tags}
                />
              </Form>
            </CardContent>
          </Card>
        </Grid>
        <Grid item direction="column" className={classes.root}>
          <Card>
            <CardHeader title="Upload Menu"/>
            <CardContent>
              <Grid container>
                <Grid item>
                  <form encType="multipart/form-data">
                    <Button component="label">
                      Upload Menu
                      <input className="hidden" type="file" id="fileInput" name="file" onChange={onMenuChange}/>
                    </Button>
                  </form>
                </Grid>
                <Grid item>
                  <Button color="secondary"
                          onClick={deleteTruckCallback}>
                    Delete Truck
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid item>
        {state.message}
      </Grid>
    </Grid>
  );
}

export default RouterSelectable<number>((truckId: number) => <EditTruck truckId={truckId}/>, "truckId");
