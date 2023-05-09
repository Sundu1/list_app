import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignIn } from "../model/Post";
import { UserContext } from "../components/LoginProvider";
import { LoadingBar } from "../components/LoadingBar";
import { Notification } from "../components/Notification";

const Login = () => {
  const { value, setValue } = useContext(UserContext);

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState();
  const [isNotif, setIsNotif] = useState(false);

  const SignInButton = async (e) => {
    setLoading(true);
    e.preventDefault();
    const userInfo = await SignIn(username, password);
    console.log(userInfo);
    if (userInfo.result) {
      localStorage.setItem("user", JSON.stringify(userInfo));
      setValue(userInfo);
      navigate("/home");
      return;
    } else if (userInfo.message) {
      setLoading(false);
      setNotif(userInfo.message);
      setIsNotif(!isNotif);
      return;
    }
    console.log(userInfo.result);
  };

  console.log(isNotif);
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      {isNotif ? (
        <div onClick={() => setIsNotif(false)}>
          <Notification prop={notif} />
        </div>
      ) : (
        ""
      )}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="Username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm 
                      rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                       dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Username"
                  required=""
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300
                       text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700
                        dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded
                             bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>
              {loading ? (
                <button
                  type="submit"
                  className="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 
                            focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 
                            py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800
                            flex justify-center"
                >
                  <LoadingBar />
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  onClick={(e) => SignInButton(e)}
                >
                  Sign in
                </button>
              )}
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <button
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  onClick={() => navigate(`/signup`)}
                >
                  Sign up
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
