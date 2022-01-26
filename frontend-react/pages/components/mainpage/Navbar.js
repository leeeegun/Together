// import {ReactComponent as Home} from '../../public/mainpage/home-icon.svg';
import Link from "next/link";


export default function Navbar({username}) {
  return (
  <nav style={{display: 'flex', alignItems: 'end'}}>
    {/* <Home /> */}
    <Link href="/main">
      <img src="mainpage/Home-Logo.png" alt="home logo" style={{width: '40px', marginRight: '1rem', cursor: 'pointer'}} />
    </Link>
    <h1 className="text-xl font-semibold c-footer-social_link">
      {username? username: "임시"}님, 안녕하세요!
    </h1>
  </nav>
    );
};

