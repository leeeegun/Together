import { useRef, useState, useEffect } from "react";


const ID_REGEX = /^[a-zA-z][a-zA-Z0-9]{3,20}$/;
const PW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$*]).{8,24}$/;


const SignupForm = () => {
  
  const userIdRef = useRef();
  const userNameRef = useRef();
  const userNickNameRef = useRef();
  const userEmailRef = useRef();
  const userStatusRef = useRef();

  const [userId, setUserId] = useState('');
  const [validUserId, setValidUserId] = useState(false);
  const [confirmedUserId, setConfirmedUserId] = useState('');

  const [userPassword, setUserPassword] = useState('');
  const [validUserPassword, setValidUserPassword] = useState(false);
  
  const [matchPassword, setMatchPassword] = useState('');
  const [validMatchPassword, setValidMatchPassword] = useState(false);

  const [userName, setUserName] = useState('');
  const [userNickName, setUserNickName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userStatus, setUserStatus] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [formReady, setFormReady] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // 아이디 중복확인
  const handleIdCheck = async (e) => {
    e.preventDefault();
    fetch('/users/{userId}/exists')
      .then((response) => response.json())
      .then((data) => {setConfirmedUserId(data)})
  }

  // 회원가입 버튼 눌렀을때 로직
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(userId, userPassword, userName, userNickName, userEmail, userStatus);
    submitRegistration();
    setUserId('');
    setUserPassword('');
    setMatchPassword('');
    setUserName('');
    setUserNickName('');
    setUserEmail('');
    setUserStatus('비 장애');
  }

  // 회원가입 POST 요청
  const submitRegistration = async() => {
    fetch('/users', {
      method: 'POST',
      body: JSON.stringify({
        "userId": userId, 
        "password": userPassword, 
        "name": userName, 
        "nickname": userNickName, 
        "email": userEmail, 
        "disability": userStatus,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      const data = response.json()
      setSuccessMessage(data);
      console.log(successMessage)
    })
    .catch((error) => {
      setErrorMessage(error)
      console.log(errorMessage)
    })
  }

  // 페이지 렌더링 시 아이디 입력창에 포커스
  useEffect(() => {
    userIdRef.current.focus();
  }, [])

  // 회원가입 버튼 활성화 조건
  useEffect(() => {
    if (confirmedUserId && validMatchPassword && userName && userNickName && userEmail && userStatus) {
      setFormReady(true);   
    }
  }, [confirmedUserId, validMatchPassword, userName, userNickName, userEmail, userStatus])

  // 아이디 조건 충족 여부 확인
  useEffect(() => {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
    const result = ID_REGEX.test(userId);
    setValidUserId(result);
  }, [userId])

  // 비밀번호와 비밀번호학인 일치 여부 판단
  useEffect(() => {
    const result = PW_REGEX.test(userPassword);
    setValidUserPassword(result);
    const match = userPassword === matchPassword;
    setValidMatchPassword(match);
  }, [userPassword, matchPassword]) 

  // 비밀번호 다 지우면 비밀번화 확인 값도 초기화
  useEffect(() => {
    if (!userPassword) {
      setMatchPassword('');
    }
  }, [userPassword])

  return (
    
    <section>
      <h1>Signup</h1>
      <form onSubmit={handleIdCheck}>
        <label htmlFor="userId">
          아이디
          <span className={validUserId ? "valid" : "hide"}>
            &#9745;
          </span>
          <span className={validUserId || !userId ? "hide" : "invalid"}>
            &#9746; 대소문자와 숫자를 혼합하여 3~20내로 작명해주세요!
          </span>
        </label>
        <br></br>
        <input
          type="text"
          id="userId"
          ref={userIdRef}
          onChange={(e) => setUserId(e.target.value)}
          autoComplete="off"
          value={userId}
          required 
        />
        <button disabled={!validUserId}>중복 검사</button>
        <span className={confirmedUserId ? "valid" : "hide"}>사용 가능한 아이디입니다!</span>
        <span className={confirmedUserId && validUserId ? "valid" : "hide"}>이미 사용중인 아이디입니다.</span>
      </form>
      <br></br>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userPassword">
          비밀번호
          <span className={validUserPassword ? "valid" : "hide"}>
            &#9745;
          </span>
          <span className={validUserPassword || !userPassword ? "hide" : "invalid"}>
            &#9746; 대소문자, 숫자, 특수문자(!@#$*)를 혼합하여 8~24내로 작성해주세요!
          </span>
        </label>
        <br></br>
        <input
          type="password"
          id="userPassword"
          onChange={(e) => setUserPassword(e.target.value)}
          value={userPassword}
          required
        />
        <br></br>
        <label htmlFor="userMatchPassword">
          비밀번호 확인
          <span className={validMatchPassword && matchPassword? "valid" : "hide"}>
            &#9745;
          </span>
          <span className={validMatchPassword || !matchPassword ? "hide" : "invalid"}>
            &#9746; 비밀번호가 일치하지 않습니다!
          </span>
        </label>
        <br></br>
        <input
          type="password"
          id="matchPassword"
          onChange={(e) => setMatchPassword(e.target.value)}
          value={matchPassword}
          disabled={!validUserPassword}
          required
        />
        <br></br>
        <label htmlFor="userName">
          이름
        </label>
        <br></br>
        <input
          type="text"
          id="userName"
          ref={userNameRef}
          onChange={(e) => setUserName(e.target.value)}
          autoComplete="off"
          value={userName}
          required 
        />
        <br></br>
        <label htmlFor="userNickName">
          닉네임
        </label>
        <br></br>
        <input
          type="text"
          id="userNickName"
          ref={userNickNameRef}
          onChange={(e) => setUserNickName(e.target.value)}
          autoComplete="off"
          value={userNickName}
          required 
        />
        <br></br>
        <label htmlFor="userEmail">
          이메일
        </label>
        <br></br>
        <input
          type="text"
          id="userEmail"
          ref={userEmailRef}
          onChange={(e) => setUserEmail(e.target.value)}
          autoComplete="off"
          value={userEmail}
          required 
        />
        <br></br>
        <label htmlFor="userStatus">
          신체 조건 : 
        </label>
        <select 
          id="userStatus" 
          onChange={(e) => setUserStatus(e.target.value)}
          value={userStatus}
          ref={userStatusRef}
          required>
          <option value="비 장애">비 장애</option>
          <option value="시각 장애">시각 장애</option>
          <option value="청각 장애">청각 장애</option>
        </select>
        <br></br>
        <hr></hr>
        <button disabled={!formReady}>회원 가입</button>
      </form>
    </section>

  )
}

export default SignupForm;