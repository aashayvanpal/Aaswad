import React from 'react';
import StarRatingComponent from 'react-star-rating-component';

export default class Star extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rating: this.props.rating,
            // rating: this.props.rating ? this.props.rating : 0,
            id: this.props.id,
            overallRating: this.props.overallRating
        };
    }

    onStarClick(nextValue, prevValue, name) {
        this.setState({ rating: nextValue });
        console.log('the rating prev:', prevValue)
        console.log('the rating:', nextValue)
        console.log('the name:', name)
        console.log('id:', this.props.id)

        this.state.overallRating ? (this.props.ChangeOverallRating(nextValue, this.props.id))
            : (this.props.ChangeItemRating(nextValue, this.props.id))

    }

    render() {
        const { rating } = this.state;

        return (
            <div>
                {/* <h2>Rating from state: {rating}</h2> */}
                <StarRatingComponent
                    name={this.props.name}
                    starCount={5}
                    value={this.props.rating}
                    starColor={"rgb(255 136 26)"}
                    onStarClick={this.onStarClick.bind(this)}
                />
            </div>
        );
    }
}

