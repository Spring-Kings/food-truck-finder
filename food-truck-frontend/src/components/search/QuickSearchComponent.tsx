import React, {useState} from 'react';
import {Dialog, DialogContent, DialogTitle, Grid, IconButton} from "@material-ui/core";
import {Close, Search} from "@material-ui/icons";
import SearchTruckComponent from "./SearchTruckComponent";

function QuickSearchComponent() {
  const [open, setOpen]: [boolean, any] = useState(false);

  return (
    <>
      <IconButton color="inherit"
                  onClick={() => setOpen(true)}>
        <Search/>
      </IconButton>
      <Dialog open={open}
              fullWidth
              maxWidth="md">
        <Grid container direction="row" justify="flex-start">
          <Grid item xs={10}>
            <DialogTitle>Search Trucks</DialogTitle>
          </Grid>
          <Grid item xs>
            <IconButton color="inherit"
                        onClick={() => setOpen(false)}>
              <Close/>
            </IconButton>
          </Grid>
        </Grid>
        <DialogContent>
          <SearchTruckComponent onRedirect={() => setOpen(false)}/>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default QuickSearchComponent;