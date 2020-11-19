import React from "react";
import {createStyles, IconButton, Theme, Typography, WithStyles, withStyles} from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {Close} from "@material-ui/icons";

// Learned from & example used: https://material-ui.com/components/dialogs/#customized-dialogs

const dialogStyles = (theme: Theme) => createStyles({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
});

export interface DialogTitleProps extends WithStyles<typeof dialogStyles> {
  children: React.ReactNode;
  onClose: () => void;
}

export const StyledDialogTitle = withStyles(dialogStyles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">
        {children}
      </Typography>
      {onClose ? (
        <IconButton color="inherit"
                    className={classes.closeButton}
                    onClick={onClose}>
          <Close/>
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});