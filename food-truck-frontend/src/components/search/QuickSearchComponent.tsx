import React, {useState} from 'react';
import {
  Dialog,
  DialogContent,
  IconButton
} from "@material-ui/core";
import {Search} from "@material-ui/icons";
import SearchTruckComponent from "./SearchTruckComponent";
import {StyledDialogTitle} from "../util/StyledDialogTitle";

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
        <StyledDialogTitle onClose={() => setOpen(false)}>
          Search Trucks
        </StyledDialogTitle>
        <DialogContent>
          <SearchTruckComponent onRedirect={() => setOpen(false)}/>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default QuickSearchComponent;