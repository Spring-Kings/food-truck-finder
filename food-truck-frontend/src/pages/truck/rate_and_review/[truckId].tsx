import React from "react";

import RouterSelectableComponent from "../../../components/util/RouterSelectableComponent";
import RateReviewComponent from "../../../components/truck/rate_and_review/RateReviewComponent";

export default RouterSelectableComponent<number>((id: number) => <RateReviewComponent truckId={id} />, "truckId");