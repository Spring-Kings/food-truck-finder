import React, {Component} from 'react';
import axios, {AxiosResponse} from 'axios';

const reviewsJSON = [{
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
}];

type Props = {
    username: string | string[] | undefined
}

type State = {
    data : {
    "id": string,
    "userId": string | undefined,
    "truckId": string,/*{"id": string,
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
    "reviewText": string | undefined,
    "day_time": string
    }[]
}





class ReviewsList extends React.Component<Props, State>{

    constructor(props: Props) {
        super(props);
        this.state = {data: reviewsJSON};
    }


    componentDidMount() {
        axios.get(`${process.env.FOOD_TRUCK_API_URL}/user/reviews`, {
            params: {
                username: this.props.username,
            }
        }).then((response) => {
                this.setState({ data: response.data })
        }).catch((error) => {
                this.setState({data: error.toString()})
        });
    }

    renderReviewElement(index: number){
        return(
            <tr>
                <td>{this.state.data[index]}</td>
                <td>{this.state.data[index].starRating}</td>
                <td>{this.state.data[index].costRating}</td>

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
                    {this.state.data[0]}
                </div>
            </div>
        );
    }
}

export default ReviewsList;