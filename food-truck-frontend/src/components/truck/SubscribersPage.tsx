import {List, ListItem} from 'material-ui';
import React, {Component} from 'react'
import {getSubscribedUsernames} from "../../api/TruckApi";

interface Props {
  truckId: number;
}

interface State {
  subscriberNames: string[] | null
  err: string | null;
}

class SubscribersPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      subscriberNames: null,
      err: null,
    };
  }

  render() {
    if (this.state.err)
      return <p>Error: {this.state.err}</p>
    if (this.state.subscriberNames === null)
      return <p>Please wait...</p>
    if (this.state.subscriberNames.length === 0)
      return <p>No subscribers.</p>
    return <>
      <h1>Subscribed Users</h1>
      <List>
        {this.state.subscriberNames.map(name => <ListItem key={name}>
          {name}
        </ListItem>)}
      </List>
    </>


  }

  async componentDidMount() {
    const names = await getSubscribedUsernames(this.props.truckId);
    if (names === null)
      this.setState({err: "Couldn't get subscriptions"})
    else
      this.setState({subscriberNames: names})
  }
}

export default SubscribersPage