import React, {Component} from 'react';
<<<<<<< HEAD
=======
import axios, {AxiosResponse} from 'axios';
>>>>>>> parent of 7105ddd... Revert "changes"
import api from "../util/api";

const reviewsJSON = {
    "id": "",
    "userId": "",
    "truck": {"id": "",
        "userId": "",
        "name": "",
        "menu": "",
        "textMenu": "",
        "priceRating": "",
        "description": "",
        "schedule": "",
        "foodCategory": ""},
    "starRating": "",
    "costRating": "",
    "reviewText": "",
    "day_time": ""
};

type Props = {
    username: string
}

type State = {
    data : [{
    "id": string,
    "userId": string,
<<<<<<< HEAD
    "truck": {"id": string,
            "userId": string,
=======
    "truckId": string,
            /*{"id": string,
            "userId": string | undefined,
>>>>>>> parent of 7105ddd... Revert "changes"
            "name": string,
            "menu": string,
            "textMenu": string,
            "priceRating": string,
            "description": string,
            "schedule": string,
            "foodCategory": string},
    "starRating": string,
    "costRating": string,
    "reviewText": string,
    "day_time": string
<<<<<<< HEAD
    }[],
=======
    }],
    dataStr: string
>>>>>>> parent of 7105ddd... Revert "changes"
}





class ReviewsList extends React.Component<Props, State>{

    constructor(props: Props) {
        super(props);
        this.state = {data: [reviewsJSON],
            dataStr: "hey"
        };
    }


<<<<<<< HEAD
    componentDidMount(){
        api.get('/user/reviews?username=' + this.props.username).then((response) => {
                this.setState({data: response.data})
        }).catch((error) => {
                console.log(error.toString())
=======
    componentDidMount() {

        api.get('/user/reviews?username=' + this.props.username).then((response) => {
                this.setState({dataStr: JSON.stringify(response.data)})
        }).catch((error) => {
                this.setState({dataStr: error.toString() + " " + process.env.FOOD_TRUCK_API_URL})
>>>>>>> parent of 7105ddd... Revert "changes"
        });
    }

    renderReviewElement(index: number){
        return(
            <tr>
<<<<<<< HEAD
                <td>{this.state.data[index].truck.name}</td>
                <td>{this.state.data[index].starRating}</td>
                <td>{this.state.data[index].costRating}</td>
                <td>{this.state.data[index].reviewText}<br/>{this.state.data[index].day_time}</td>
=======
                <td>{this.state.data[index].truckId}</td>
                <td>{this.state.data[index].starRating}</td>
                <td>{this.state.data[index].costRating}</td>
                <td>{this.state.data[index].reviewText} </td>
>>>>>>> parent of 7105ddd... Revert "changes"
            </tr>
        );
    }

    render() {

        if(this.state.data.length == 0){
            return(
                <div>
                    <h2>No Reviews</h2>
                </div>
            )
        }
        return (
            <div>
            <h2>Reviews</h2>
                <div>
                    <table>
                        <tr>
                            <th>Food Truck</th>
                            <th>Overall Rating</th>
                            <th>Price Rating</th>
                            <th>Review</th>
                        </tr>
                        {this.state.data.map(((value, index) => this.renderReviewElement(index)))}
                    </table>
<<<<<<< HEAD
=======
                    <p>{this.state.dataStr}</p>
>>>>>>> parent of 7105ddd... Revert "changes"
                </div>
            </div>
        );
    }
}

export default ReviewsList;