import React, {Component} from 'react';
import axios, {AxiosResponse} from 'axios';
import api from "../util/api";

const reviewsJSON = {
    "id": "",
    "userId": "",
    "truckId": "",/*{"id": "",
        "userId": "",
        "name": "",
        "menu": "",
        "textMenu": "",
        "priceRating": "",
        "description": "",
        "schedule": "",
        "foodCategory": ""},*/
    "starRating": "",
    "costRating": "",
    "reviewText": "",
    "day_time": ""
};

type Props = {
    username: string | string[] | undefined
}

type State = {
    data : [{
    "id": string,
    "userId": string,
    "truckId": string,
            /*{"id": string,
            "userId": string | undefined,
            "name": string,
            "menu": string | undefined,
            "textMenu": string | undefined,
            "priceRating": string | undefined,
            "description": string | undefined,
            "schedule": string | undefined,
            "foodCategory": string | undefined },*/
    "starRating": string,
    "costRating": string,
    "reviewText": string,
    "day_time": string
    }],
    dataStr: string
}





class ReviewsList extends React.Component<Props, State>{

    constructor(props: Props) {
        super(props);
        this.state = {data: [reviewsJSON],
            dataStr: "hey"
        };
    }


    componentDidMount() {

        api.get('/user/reviews?username=' + this.props.username).then((response) => {
                this.setState({dataStr: JSON.stringify(response.data)})
        }).catch((error) => {
                this.setState({dataStr: error.toString() + " " + process.env.FOOD_TRUCK_API_URL})
        });
    }

    renderReviewElement(index: number){
        return(
            <tr>
                <td>{this.state.data[index].truckId}</td>
                <td>{this.state.data[index].starRating}</td>
                <td>{this.state.data[index].costRating}</td>
                <td>{this.state.data[index].reviewText} </td>
            </tr>
        );
    }

    render() {
        return (
            <div>
            <h2>Reviews</h2>
                <div>
                    <table>
                        <tr>
                            <th>Truck</th>
                            <th>Overall Rating</th>
                            <th>Price Rating</th>
                            <th>Review</th>
                        </tr>

                    </table>
                    <p>{this.state.dataStr}</p>
                </div>
            </div>
        );
    }
}

export default ReviewsList;