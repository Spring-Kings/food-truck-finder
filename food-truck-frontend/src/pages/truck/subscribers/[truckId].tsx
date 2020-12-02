import React from "react";

import RouterSelectableComponent from "../../../components/util/RouterSelectableComponent";
import SubscribersPage from "../../../components/truck/SubscribersPage";

export default RouterSelectableComponent<number>((id: number) => <SubscribersPage truckId={id}/>, "truckId");