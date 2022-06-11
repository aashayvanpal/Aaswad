import React from 'react'
import burgerIcon from '../images/burger_icon.png'

const ShowBtn = () => {
    return (
        <button
            id="ShowButton"
            onClick={() => {
                var navBarElement = document.getElementById("Nav-bar");
                navBarElement.style.display = "block";

                var showElement = document.getElementById("ShowButton");
                showElement.style.display = "none";
            }}
        >
        <img src={burgerIcon} alt="" height="20px" width="20px" />
        Show
        </button>
    )
}

export default ShowBtn