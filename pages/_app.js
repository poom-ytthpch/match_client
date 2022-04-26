import "../styles/globals.css";
import "../styles/company.css";
import "../styles/login.css";
import "../styles/home.css";
import "../styles/product.css";
import "../styles/board.css";
import "../styles/dashboard.css";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies, { set } from "js-cookie";
import Sidebar from "../components/Sidebar";
import Login from "./login";
import Router from "next/router";
import Link from "next/link";
function MyApp({ Component, pageProps }) {
  const [token, setToken] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const Verify = async () => {
      await CookieCheck();
      // await tokenCheck();

      // await getBoard();
    };
    Verify();
  }, []);

  const CookieCheck = async () => {
    if (!Cookies.get("_t_")) {
      Object.keys(Cookies.get()).forEach((e) => {
        Cookies.remove(e);
      });
      await Router.push("/login");
      // await (<Link to="/login" />);
    }
  };
  const tokenCheck = async () => {
    if (Cookies.get("token")) {
      await Router.push("/dashboard");

      await setToken(Cookies.get("token"));

      setIsLogin(true);
      // window.location.reload(false);
    } else {
      setIsLogin(false);
      await Router.push("/login");
    }
  };

  const Pages = () => {
    if (Cookies.get("_t_")) {
      return (
        <Sidebar>
          <Component {...pageProps} />
        </Sidebar>
      );
    } else {
      return <Component {...pageProps} />;
    }
  };

  return Pages();
}

export default MyApp;
