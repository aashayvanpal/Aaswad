import SignInForm from "./SignInForm";
import signinImage from "../images/aaswad-logo.svg";
import ReactAnime from 'react-animejs'
const { Anime } = ReactAnime

export default function SignupCenterContainer() {
  return (
    <div style={{ display: "flex" }}>

      <div id="leftContainerImg">
        <img
          src={signinImage}
          width="400px"
          height="400px"
          style={{ marginLeft: "100px", marginTop: "30px" }}
          alt="signinimage"
        />
      </div>
      <Anime
        initial={[
          {
            targets: "#leftContainerImg",
            translateX: [-200, 0],
            easing: "easeInOutSine",
            opacity: [0, 1],
            delay: 0
          }
        ]}
      >
      </Anime>
      <SignInForm />
    </div>
  );
}
