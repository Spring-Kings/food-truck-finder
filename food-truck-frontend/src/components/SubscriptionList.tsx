import React from 'react';
import Truck from "../domain/Truck";
import {loadSubscriptionsForUser} from "../api/UserApi";

type SubscriptionProps = {
  username: string
}

type SubscriptionState = {
  subscribedTrucks: Truck[] | null
}

class SubscriptionList extends React.Component<SubscriptionProps, SubscriptionState> {

  constructor(props: SubscriptionProps) {
    super(props);

    this.state = {subscribedTrucks: null}
  }

  async componentDidMount() {
    this.setState({subscribedTrucks: await loadSubscriptionsForUser(this.props.username)});
  }

  render() {
    if (!this.state.subscribedTrucks) {
      return (
        <div>
          <h2>No Subscriptions</h2>
        </div>
      )
    }

                return (
                    <div>
                            <h2>Subscriptions</h2>
                            <table>
                                    <tr>
                                            <th>Food Trucks</th>
                                    </tr>
                            </table>
                    </div>
                );
        }


}

export default SubscriptionList;