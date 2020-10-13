import React, {Component} from 'react';
import api from "../util/api";

const reviewsJSON = [{
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
}];

type Props = {
    username: string
}

type State = {
    data : {
        "id": string,
        "userId": string,
        "truck": {"id": string,
            "userId": string,
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
    }[],
}





class ReviewsList extends React.Component<Props, State>{

    constructor(props: Props) {
        super(props);
        this.state = {data: reviewsJSON};
    }


    componentDidMount(){
        api.get('/user/reviews?username=' + this.props.username).then((response) => {
            this.setState({data: response.data})
        }).catch((error) => {
            console.log(error.toString())
        });
    }

    renderReviewElement(index: number){
        return(
            <tr>
                <td>{this.state.data[index].truck.name}</td>
                <td>{this.state.data[index].starRating}</td>
                <td>{this.state.data[index].costRating}</td>
                <td>{this.state.data[index].reviewText}<br/>{this.state.data[index].day_time}</td>
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
                </div>
            </div>
        );
    }
}

export default ReviewsList;