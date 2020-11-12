import React from "react";
import RateReviewComponent from "../../../../components/truck/rate_and_review/RateReviewComponent";

import RouterSelectableComponent from "../../../../components/util/RouterSelectableComponent";

export default RouterSelectableComponent<number>((id: number) => <RateReviewComponent truckId={id} />, "truckId");