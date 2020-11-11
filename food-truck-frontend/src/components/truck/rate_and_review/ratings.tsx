import React from "react";

import { withStyles } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import MoneyIcon from "@material-ui/icons/AttachMoney";

// Learned from: https://material-ui.com/components/rating/
const MoneyRatingInternal = withStyles({
  iconFilled: {
    color: "#00AA00",
  },
  iconHover: {
    color: "#00AA00",
  },
})(Rating);

export const MoneyRating = (props: any) => (<MoneyRatingInternal icon={<MoneyIcon />} {...props} />);
export const StarRating = (props: any) => (<Rating {...props} />);
