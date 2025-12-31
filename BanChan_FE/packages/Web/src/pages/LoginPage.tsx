import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_BASE_API_URL;
const LoginPage = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([
    "Token",
    "rememberUserId",
    "rememberUserPw",
  ]);
  const [user, setUser] = useState({
    userId: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (
      cookies.rememberUserId !== undefined ||
      cookies.rememberUserPw !== undefined
    ) {
      setUser({
        userId: cookies.rememberUserId,
        password: cookies.rememberUserPw,
      });
      // setUserId 함수를 호출하여 state 변수인 userId의 값을 cookies.rememberUserId로 설정
      setRememberMe(true);
      // state 변수인 setIsRemember 값을 true로 설정
    }
  }, [cookies.rememberUserId, cookies.rememberUserPw]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
    if (!e.target.checked) {
      removeCookie("rememberUserId"); // 쿠키 삭제
      removeCookie("rememberUserPw"); // 쿠키 삭제
    } else if (rememberMe) {
      // 체크박스가 체크되어있고, isRemember이 true라면
      setCookie("rememberUserId", user.userId, {
        path: "/",
        expires: new Date(Date.now() + 604800000),
      });
      setCookie("rememberUserPw", user.password, {
        path: "/",
        expires: new Date(Date.now() + 604800000),
      });
    }
  };

  const validate = async () => {
    if (user.userId === "") {
      alert("아이디를 입력해주세요.");
    } else if (user.password === "") {
      alert("비밀번호를 입력해주세요.");
    } else {
      try {
        const response = await axios.post(`${API_URL}/api/auth/origin/login`, {
          userId: user.userId,
          passwordHash: user.password,
        });

        setCookie("Token", response.data.accessToken);

        setTimeout(async () => {
          const config = {
            headers: {
              Authorization: `Bearer ${response.data.accessToken}`, // Use response data directly here
            },
          };

          try {
            const user_data = await axios.get(
              `${API_URL}/api/user/myinfo`,
              config
            );

            alert(`${user_data.data.username}님 환영합니다!`);
            if (rememberMe) {
              setCookie("rememberUserId", user.userId, {
                path: "/",
                expires: new Date(Date.now() + 604800000),
              });
              setCookie("rememberUserPw", user.password, {
                path: "/",
                expires: new Date(Date.now() + 604800000),
              });
            }
            navigate("/home");
          } catch (err) {
            console.error(err);
            alert("유저 정보를 들고오는데 실패하였습니다");
          }
        }, 100);
      } catch (err) {
        console.error(err);
        alert("로그인에 실패하였습니다 아이디,비밀번호를 확인해주세요");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300">
      <div className="flex flex-col justify-center w-[700px] h-[480px] p-[30px] bg-white shadow-md rounded-lg">
        <div className="text-center mb-8">
          <header className="text-2xl font-semibold text-gray-800">
            로그인
          </header>
        </div>
        <div className="mb-8">
          <input
            name="userId"
            type="text"
            className="w-full h-14 text-lg px-6 rounded-lg shadow-md border-solid border-2 outline-none transition-transform transform focus:scale-105"
            placeholder="아이디"
            autoComplete="off"
            required
            value={user.userId}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <input
            name="password"
            type="password"
            className="w-full h-14 text-lg px-6 rounded-lg shadow-md border-solid border-2 outline-none transition-transform transform focus:scale-105"
            placeholder="비밀번호"
            autoComplete="off"
            required
            value={user.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-between items-center mb-14">
          <label className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              id="check"
              className="mr-2"
              checked={rememberMe}
              onChange={handleCheckboxChange}
            />
            로그인 정보 저장
          </label>
          <a href="#" className="text-sm text-gray-600 hover:underline">
            비밀번호 찾기
          </a>
        </div>
        <div className="relative">
          <button
            className="w-full h-14 bg-customBlue text-white rounded-lg transition-transform transform hover:bg-customBlue hover:scale-105"
            id="submit"
            onClick={validate}
          >
            로그인
          </button>
        </div>
        {/* <div className="text-center text-sm">
          <p>
            아이디가 존재하지 않습니까?{" "}
            <Link
              to="/signup"
              className="text-black font-semibold hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;
