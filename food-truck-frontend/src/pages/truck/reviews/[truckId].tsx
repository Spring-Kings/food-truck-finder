import React from "react";
import ReviewListComponent from "../../../components/truck/rate_and_review/ReviewList";

import RouterSelectableComponent from "../../../components/util/RouterSelectableComponent";

export default RouterSelectableComponent<number>((id: number) => <ReviewListComponent truckId={id} />, "truckId");