import { useRef, useState, useEffect } from "react";
import Swal from "sweetalert2";

const ID_REGEX = /^[a-zA-z][a-zA-Z0-9]{3,20}$/;
const PW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$*]).{8,24}$/;
const EMAIL_REGEX = /^(?=.*[@])(?=.*[.com]).{8,40}$/;

const SignupForm = ({signUpComplete}) => {
  const userEmailRef = useRef();
  const userStatusRef = useRef();
  const signupRef = useRef();

  const [userId, setUserId] = useState("");
  const [validUserId, setValidUserId] = useState(false);
  const [confirmedUserId, setConfirmedUserId] = useState(false);

  const [userPassword, setUserPassword] = useState("");
  const [validUserPassword, setValidUserPassword] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatchPassword, setValidMatchPassword] = useState(false);

  const [userName, setUserName] = useState("");
  const [userNickName, setUserNickName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [validUserEmail, setValidUserEmail] = useState(false);
  const [userStatus, setUserStatus] = useState("해당 없음");

  const [errorMessage, setErrorMessage] = useState("");
  const [formReady, setFormReady] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // 아이디 중복확인
  const handleIdCheck = async (e) => {
    e.preventDefault();

    fetch(`https://i6a406.p.ssafy.io:8443/users/${userId}/exists`)
      .then((response) => response.json())
      .then((data) => {
        setConfirmedUserId(data);
      });
  };

  // 회원가입 버튼 눌렀을때 로직
  const handleSubmit = async (e) => {
    e.preventDefault();
    submitRegistration();
    initializeData();
  };

  // 회원가입 POST 요청
  const submitRegistration = async () => {
    fetch(`https://i6a406.p.ssafy.io:8443/users`, {
      method: "POST",
      body: JSON.stringify({
        userId: userId,
        password: userPassword,
        name: userName,
        nickname: userNickName,
        email: userEmail,
        disability: userStatus,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        // if (!response.ok) throw new Error(response.status);
        // else return response.json();
        return response.json();
      })
      .then((data) => {
        setSuccessMessage(data);
        return fetch(
          `https://i6a406.p.ssafy.io:8443/conference/create/${userId}`,
        )
          .then((response) => {
            if (!response.ok) throw new Error(response.statusText);
          })
          .catch(() => {});
      })
      .catch((error) => {
        setErrorMessage(error);
      });
  };
  const userConfirmedId = (e) => {
    e.preventDefault();
    const idNavigator = document.getElementById("id-navigator");
    idNavigator.classList.toggle("hide");
    idNavigator.classList.toggle("valid");
    const idInput = document.getElementById("userId");
    idInput.disabled = true;
  };
  // 회원가입 누르면 회원 정보 입력창 정보 초기화
  const initializeData = async () => {
    setUserId("");
    setUserPassword("");
    setMatchPassword("");
    setUserName("");
    setUserNickName("");
    setUserEmail("");
    setUserStatus("해당 없음");
  };

  // 페이지 렌더링 시 아이디 입력창에 포커스
  // useEffect(() => {
  //   userIdRef.current.focus();
  // }, []);

  useEffect(() => {
    if (validUserId && userId) {
      fetch(`https://i6a406.p.ssafy.io:8443/users/${userId}/exists`)
        .then((response) => response.json())
        .then((data) => {
          setConfirmedUserId(data);
        });
    }
  }, [validUserId, userId]);

  // 회원가입 버튼 활성화 조건
  useEffect(() => {
    if (
      confirmedUserId &&
      validMatchPassword &&
      userName &&
      userNickName &&
      userEmail &&
      userStatus &&
      validUserEmail
    ) {
      setFormReady(true);
    }
  }, [
    confirmedUserId,
    validMatchPassword,
    userName,
    userNickName,
    userEmail,
    userStatus,
  ]);

  // 아이디 조건 충족 여부 확인
  useEffect(() => {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
    const result = ID_REGEX.test(userId);
    setValidUserId(result);
  }, [userId]);

  // 아이디 다 지우면 아이디 state 초기화
  useEffect(() => {
    if (!userId) {
      setUserId("");
      setValidUserId(false);
      setConfirmedUserId(false);
    }
    if (validUserId === false) {
      setConfirmedUserId(false);
    }
  }, [userId]);

  // 비밀번호와 비밀번호학인 일치 여부 판단
  useEffect(() => {
    const result = PW_REGEX.test(userPassword);
    setValidUserPassword(result);
    const match = userPassword === matchPassword;
    setValidMatchPassword(match);
  }, [userPassword, matchPassword]);

  // 비밀번호 다 지우면 비밀번화 확인 값도 초기화
  useEffect(() => {
    if (!userPassword) {
      setMatchPassword("");
    }
  }, [userPassword]);

  // 이메일 유효성 확인
  useEffect(() => {
    const result = EMAIL_REGEX.test(userEmail);
    setValidUserEmail(result);
  }, [userEmail]);

  // 회원가입 성공 메세지 반환

  //나중에 코드 201로 바꿔야함
  useEffect(() => {
    if (successMessage.statusCode === 201) {
      Swal.fire({
        title: "<strong>회원가입 완료!</strong>",
        html: "이제부터 모든 기능을 사용할 수 있어요!",
        icon: "success",
      });
      signUpComplete();
    }
    if (successMessage.statusCode === 400) {
      Swal.fire({
        title: "<strong>회원가입 실패!</strong>",
        html: "오류가 발생했어요 😅",
        icon: "error",
      });
    }
    setSuccessMessage("");
  }, [successMessage]);

  // 회원가입 실패 메세지 반환
  useEffect(() => {
    setErrorMessage("");
  }, [errorMessage]);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen right snap-center">
      <section className="flex flex-col px-6 py-8 bg-[#E1E2E1] rounded-[50px] shadow sm:px-10 lg:max-w-sm w-4/12 xs:min-w-max"
       role="form"
       aria-label="회원가입 창" 
       tabIndex="0"
      >
        <h1 className="text-center">
          회원가입
        </h1>

        <form
          className="mb-0 "
          onSubmit={handleIdCheck}
          className="lg:max-w-xs"
        >
          <label
            htmlFor="userId"
            className="relative block mt-10 text-sm font-medium 10"
          >
            아이디
            <span className={validUserId ? "valid" : "hide"}>&#9745;</span>
            <span className={validUserId || !userId ? "hide" : "invalid"}>
              &#9746; 대소문자와 숫자를 혼합하여 3~20내로 작명해주세요!
            </span>
          </label>
          <div className="container w-">
            <div>
              <input
                type="text"
                id="userId"
                onChange={(e) => setUserId(e.target.value)}
                autoComplete="off"
                value={userId}
                required
                aria-required
                className="border border-[#F1EDE3] px-3 py-1 rounded-lg shadow-sm focus:outline-none focus:border-[#BEBBB1] focus:ring-1 focus:ring-[#BEBBB1] w-full"
                aria-labelledby="idInfo"
              />
              <span hidden id="idInfo" role="">아이디, 대소문자와 숫자를 혼합하여 3글자에서 20글자 내로 작명해주세요</span>
            </div>
            <div className="mx-auto">
              <span
                className={confirmedUserId ? "valid" : "hide"}
                id="id-navigator"
                role="note"
                tabIndex="0"
              >
                사용 가능한 아이디입니다!
                <p>
                  사용하시겠습니까?{" "}
                  <button
                    onClick={(e) => userConfirmedId(e)}
                    className="hover:cursor-pointer"
                  >
                    사용하기
                  </button>
                </p>
              </span>
              <span
                tabIndex="0"
                role="note"
                className={!confirmedUserId && validUserId ? "valid" : "hide"}
              >
                이미 사용중인 아이디입니다.
              </span>
            </div>
          </div>
        </form>

        <form
          className="container flex flex-col mt-8 space-y-8"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="userPassword" className="block text-sm font-medium">
              비밀번호
              <span className={validUserPassword ? "valid" : "hide"}>
                &#9745;
              </span>
              <span
                className={
                  validUserPassword || !userPassword ? "hide" : "invalid"
                }
              >
                &#9746; 대소문자, 숫자, 특수문자(!@#$*)를 혼합하여
                <br />
                8~24내로 작성해주세요!
              </span>
              <span id="pwInfo" role="note" hidden>
                비밀번호, 대소문자 숫자 특수문자 !@#$* 를 혼합하여 8글자에서
                24글자 내로 작성해주세요
              </span>
            </label>
            <div className="mt-1">
              <input
                type="password"
                id="userPassword"
                onChange={(e) => setUserPassword(e.target.value)}
                value={userPassword}
                required
                aria-required
                className="border border-[#F1EDE3] px-3 py-1 rounded-lg shadow-sm focus:outline-none focus:border-[#BEBBB1] focus:ring-1 focus:ring-[#BEBBB1] w-full"
                aria-labelledby="pwInfo"
              />
            </div>
            <span
              role="note"
              tabIndex="0"
              className={userPassword ? "valid" : "hide"}
            >
              {validUserPassword
                ? "사용가능한 비밀번호"
                : "사용불가능한 비밀번호"}
            </span>
          </div>

          <div>
            <label
              htmlFor="userMatchPassword"
              className="block text-sm font-medium"
              id="pwConfInfo"
            >
              비밀번호 확인
              <span
                className={
                  validMatchPassword && matchPassword ? "valid" : "hide"
                }
              >
                &#9745;
              </span>
              <span
                className={
                  validMatchPassword || !matchPassword ? "hide" : "invalid"
                }
              >
                &#9746;
              </span>
            </label>
            <div style={{ marginTop: 0 }}>
              <input
                type="password"
                id="matchPassword"
                onChange={(e) => setMatchPassword(e.target.value)}
                value={matchPassword}
                disabled={!validUserPassword}
                required
                aria-required
                className="border border-[#F1EDE3] px-3 py-1 rounded-lg shadow-sm focus:outline-none focus:border-[#BEBBB1] focus:ring-1 focus:ring-[#BEBBB1] w-full"
                aria-labelledby="pwConfInfo"
              />
            </div>
            <span
              role="note"
              tabIndex="0"
              className={matchPassword ? "valid" : "hide"}
            >
              {validMatchPassword ? "비밀번호 일치" : "비밀번호 불일치"}
            </span>
          </div>

          <div>
            <label htmlFor="userName" className="block text-sm font-medium">
              이름
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="userName"
                // ref={userNameRef}
                onChange={(e) => setUserName(e.target.value)}
                autoComplete="off"
                value={userName}
                required
                aria-required
                className="border border-[#F1EDE3] px-3 py-1 rounded-lg shadow-sm focus:outline-none focus:border-[#BEBBB1] focus:ring-1 focus:ring-[#BEBBB1] w-full"
                placeholder="예: 홍길동"
                maxLength="5"
                aria-labelledby="nameInfo"
              />
            </div>
            <span role="note" id="nameInfo" hidden>
              이름, 3글자에서 5글자로 작성해주세요.
            </span>
          </div>

          <div>
            <label htmlFor="userNickName" className="block text-sm font-medium">
              닉네임
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="userNickName"
                // ref={userNickNameRef}
                onChange={(e) => setUserNickName(e.target.value)}
                autoComplete="off"
                value={userNickName}
                required
                aria-required
                className="border border-[#F1EDE3] px-3 py-1 rounded-lg shadow-sm focus:outline-none focus:border-[#BEBBB1] focus:ring-1 focus:ring-[#BEBBB1] w-full"
              />
            </div>
          </div>

          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium">
              이메일
              <span
                id="emailInfo"
                className={!validUserEmail && userEmail ? "valid" : "hide"}
              >
                이메일, 이메일 형식으로 작성 해주세요! (예: xxx@xxx.com)
              </span>
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="userEmail"
                ref={userEmailRef}
                onChange={(e) => setUserEmail(e.target.value)}
                autoComplete="off"
                value={userEmail}
                required
                aria-required
                className="border border-[#F1EDE3] px-3 py-1 rounded-lg shadow-sm focus:outline-none focus:border-[#BEBBB1] focus:ring-1 focus:ring-[#BEBBB1] w-full"
                aria-labelledby="emailInfo"
              />
            </div>
          </div>

          <div className="container flex justify-evenly">
            <label htmlFor="userStatus" className="my-auto text-sm font-medium">
              장애 유형 :
            </label>
            <select
              id="userStatus"
              onChange={(e) => setUserStatus(e.target.value)}
              value={userStatus}
              ref={userStatusRef}
              required
              aria-required
              className="border border-[#F1EDE3] rounded-lg shadow-sm focus:outline-none focus:border-[#BEBBB1] focus:ring-1 focus:ring-[#BEBBB1]"
            >
              <option value="해당 없음">해당 없음</option>
              <option value="시각 장애">시각 장애</option>
              <option value="청각 장애">청각 장애</option>
            </select>
          </div>

          <div className="mt-1 text-center">
            <button
              className="border border-[#BEBBB1] bg-[#BEBBB1] px-3 py-1 rounded-lg shadow-sm w-2/5"
              disabled={!formReady}
            >
              회원 가입
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default SignupForm;
