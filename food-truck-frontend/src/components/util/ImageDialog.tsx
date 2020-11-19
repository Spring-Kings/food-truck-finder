import React, {useState} from 'react';
import {Button, Dialog, DialogContent, DialogTitle, Grid, IconButton} from "@material-ui/core";
import {Close} from "@material-ui/icons";

interface ImageDialogProps {
  url: string;
  text: string;
}

function ImageDialog(props: ImageDialogProps) {
  const [open, setOpen]: [boolean, any] = useState(false);

  return (
    <>
      <Button color="primary"
                  onClick={() => setOpen(true)}>
        View {props.text}
      </Button>
      <Dialog open={open}
              fullWidth
              maxWidth="md">
        <Grid container direction="row" justify="flex-start">
          <Grid item xs={10}>
            <DialogTitle>{props.text}</DialogTitle>
          </Grid>
          <Grid item xs>
            <IconButton color="inherit"
                        onClick={() => setOpen(false)}>
              <Close/>
            </IconButton>
          </Grid>
        </Grid>
        <DialogContent>
          <img src={props.url} alt={props.text}/>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImageDialog;