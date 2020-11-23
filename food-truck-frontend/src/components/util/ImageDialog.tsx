import React, {useState} from 'react';
import {Button, Dialog, DialogContent} from "@material-ui/core";
import {StyledDialogTitle} from "./StyledDialogTitle";

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
        <StyledDialogTitle onClose={() => setOpen(false)}>
          {props.text}
        </StyledDialogTitle>
        <DialogContent>
          <img src={props.url} alt={props.text}/>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImageDialog;