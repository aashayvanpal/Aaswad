import SignInForm from "./SignInForm";
import signinImage from "../images/aaswad-logo.svg";

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
      <SignInForm />
    </div>
  );
}
