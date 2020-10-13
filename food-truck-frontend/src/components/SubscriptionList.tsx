import React, {Component} from 'react';
import {AxiosResponse} from "axios";
import api from "../util/api";

type Props = {
        username: string
}

type State = {
        data:
            {
                    "id": string,
                    "userId": string,
                    "name": string,
                    "menu": string,
                    "textMenu": string,
                    "priceRating": string,
                    "description": string,
                    "schedule": string,
                    "foodCategory": string
            }[]
}

const subscriptionJSON =
    [{
            "id": "",
            "userId": "",
            "name": "ice cream",
            "menu": "",
            "textMenu": "",
            "priceRating": "",
            "description": "",
            "schedule": "",
            "foodCategory": ""
    }];


class SubscriptionList extends React.Component<Props, State>{

        constructor(props: Props) {
                super(props);

                this.state = {data: subscriptionJSON}
        }

        componentDidMount() {
                api.get('/user/subscriptions?username=' + this.props.username).then((response) => {
                        this.setState({data: response.data})
                }).catch((error) => {
                        console.log(error.toString())
                });
        }

        render() {
                if(this.state.data.length == 0){
                        return(
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
                                    {this.state.data.map((value, index) => this.renderSubscriptionElement(index))}
                            </table>
                    </div>
                );
        }

        renderSubscriptionElement(index: number){
                return(
                    <tr>
                            <td>{this.state.data[index].name}</td>
                    </tr>
                );
        }
}

export default SubscriptionList;