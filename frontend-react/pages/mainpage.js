// import Head from "next/head";
// import styles from '../styles/main.module.css'
// import '../styles/main.module.css'
import Image from "next/image";


export default function Mainpage() {

  const copying = () => {
    const copyText = document.getElementById('mainpage-meeting-url').innerText;
    navigator.clipboard.writeText(copyText)
    alert('클립보드에 복사되었습니다!')
  }

  return (
  <>
    <div id="mainpage-tempside">
    {/* <div id="tempside"> */}
    </div>
    <section id="mainpage">
      <div id="mainpage-menu">
        <div id="mainpage-card">
          <h1 className='m-3 text-3xl font-bold'>
            내 회의실
          </h1>
          <p>
            내 주소: <a style={{wordBreak: 'break-word'}} id="mainpage-meeting-url">https://www.instagram.com/zuck/</a>
            <button onClick={copying} className="bg-[#009e747a] text-white ml-2 p-1 rounded">복사</button>
          </p>
        </div>

        <div>
          <label htmlFor='mainpage-input-area'>
            <h1 className='m-3 text-3xl font-bold'>
              회의 참가
            </h1>
          </label>
          <input type='checkbox' id="mainpage-input-area" style={{display: 'none'}}></input>
          <div>
            <form>
              <input className='h-10' style={{border: '1px solid black', width: '55%'}} type="text" name='roomnumber' placeholder='회의 주소를 입력해 주세요.' />
              <button className='h-10 bg-[#009e747a] text-white ml-2 p-1 rounded'>제출</button>
            </form>
          </div>
        </div>

        <div>
          <h1 className='m-3 text-3xl font-bold'>
            회의 생성
          </h1>
          <img style={{top: '42%', left: '35%', width: '1000px'}} className="mainpage-effectimg" src='./mainpage/conference.jpg' alt='conference'></img>
        </div>

        <div>
          <h1 className='m-3 text-3xl font-bold'>
            FAQ
          </h1>
        </div>

        <div>
          <h1 className='m-3 text-3xl font-bold'>
            My Page
          </h1>
          <img style={{top: '48%', left: '35%', width: '800px'}} className="mainpage-effectimg" src='./mainpage/Descartes.png' alt='my page'></img>
        </div>

        <div>
          <h1 className='m-3 text-3xl font-bold'>
            로그아웃
          </h1>
          {/* <Image className={styles.effectimg} width={400} height={400} src='/conference.jpg' alt='conference'></Image> */}
          {/* <Image className="mainpage-effectimg" width={400} height={400} src='/conference.jpg' alt='conference'></Image> */}
        </div>

        

      </div>
    </section>
  </>
  );

}