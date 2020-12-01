import React from "react";

import RouterSelectableComponent from "../../../components/util/RouterSelectableComponent";
import TruckReviewPage from "../../../components/truck/rate_and_review/TruckReviewPage";

export default RouterSelectableComponent<number>((id: number) => <TruckReviewPage truckId={id} />, "truckId");