import SignInForm from "./SignInForm";
import { Link } from 'react-router-dom'
import downloadIcon from '../images/download-pdf-icon.png'

export default function SignupCenterContainer() {
  return (
    <div id="sign-in-container" >
      <div id="leftContainerImg">
        <Link to="/AaswadMenuCard-2022.pdf" target="_blank" download>
          <button id="downloadBtn"
          >Download Menu Card <img src={downloadIcon} alt="downloadIcon" height="50px" /></button></Link>
      </div>
      <SignInForm />

    </div>
  );
}
