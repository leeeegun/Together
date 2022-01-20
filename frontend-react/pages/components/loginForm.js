import { useState, useEffect, useRef } from "react";


const LoginForm = () => {

  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');
  
  const userIdRef = useRef();

  useEffect(() => {
    userIdRef.current.focus();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userId, userPassword);
    setUserId('');
    setUserPassword('');
  }

  return (
    <section>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userid">
          아이디
        </label>
        <input
          type="text"
          id="userid"
          ref={userIdRef} // 페이지 렌더 되면 이곳 포커스
          onChange={(e) => setUserId(e.target.value)}
          autoComplete="off"
          value={userId} // 이게 무슨 역할을 하는거지
          required
        />
        <label htmlFor="userPassword">
          비밀번호
        </label>
        <input
          type="password"
          id="userPassword"
          onChange={(e) => setUserPassword(e.target.value)}
          value={userPassword}
          required
        />
        <button>로그인</button>
      </form>
    </section>
  )
}

export default LoginForm;