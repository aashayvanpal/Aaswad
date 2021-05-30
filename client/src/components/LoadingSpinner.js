import { useState } from "react";
import { css } from "@emotion/react";
import CircleLoader from "react-spinners/CircleLoader";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: green;
`;

function LoadingSpinner() {
    let [loading, setLoading] = useState(true);

    return (
        <div className="sweet-loading">

            <CircleLoader color={'rgb(219, 194, 104)'} loading={loading} css={override} size={200} />
        </div>
    );
}

export default LoadingSpinner;