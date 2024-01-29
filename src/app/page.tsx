import Image from "next/image";
import '@/css/index.css'
import Navbar from '@/components/navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="introduction">
        <p>Introducing Loom</p>
        <h1>The tutoring platform made for students by students.</h1>
      </div>
    </>
  );
}
