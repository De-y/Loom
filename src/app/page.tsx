import Image from "next/image";
import '@/css/index.css'
import Navbar from '@/components/navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faLink } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="introduction">
        <p>Introducing Loom</p>
        <h1>The tutoring platform made for students by students.</h1>
      </div>
      <div className="grid">
        <div className="login">
          <h1>Login to your account</h1>
          <p>To be able to continue.</p>
          <br />
          <a>Login <FontAwesomeIcon icon={faArrowRight}/></a>
        </div>
        <br />
        <div className="signup">
          <h1>If you don't have an account</h1>
          <p>Apply for an account to be able to continue.</p>
          <br />
          <a>Apply <FontAwesomeIcon icon={faLink}/></a>
        </div>
      </div>
    </>
  );
}
