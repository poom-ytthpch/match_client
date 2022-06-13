import axios from "axios";
import Router from "next/router";
import { useEffect, useState } from "react";
import cookie from "js-cookie";
import Link from "next/link";
import dayjs from "dayjs";
const Swal = require("sweetalert2");
import Head from "next/head";
const server_config = require("../config/config");

const Login = () => {
  const [now, setNow] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [online, setOnline] = useState(true);

  // const server = "https://userlogapi.herokuapp.com";
  // const server = "https://www.matchchemical.tk:57521";
  // const server = "http://localhost:4008/v1";
  // const server = "https://home420.trueddns.com:57527/v1";
  const server = server_config.host;

  useEffect(() => {
    const Verify = async () => {
      await cookieCheck();
    };
    if (cookie.get("_t_")) {
      Router.push("/dashboard");
    }

    setInterval(() => {
      timer();
      internetCheck();
    }, 1000);

    Verify();
  }, []);

  const internetCheck = () => {
    const iCheck = navigator.onLine;
    setOnline(iCheck);
  };

  const timer = () => {
    const time = Date(Date.now);
    const tmpTime = time.split(" ");
    const Months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let tmpMonth = 0;
    const day = tmpTime[2];
    const year = tmpTime[3];
    const Time = tmpTime[4];

    for (let i = 0; i < Months.length; i++) {
      if (tmpTime[1] === Months[i]) {
        tmpMonth = i + 1;
      }
    }

    const month = tmpMonth;
    setNow(day + "/" + month + "/" + year + " " + Time);
  };

  const cookieCheck = async () => {
    if (cookie.get("_t_")) {
      await Router.push("/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((email, password) !== "") {
      const wait = Swal.fire({
        title: "PLEASE WAIT!",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await axios
          .post(`${server}/login`, {
            email: email,
            password: password,
          })
          .then((res) => {
            if (res.data.status) {
              cookie.set("_t_", res.data.user.token);
              cookie.set("_n_", res.data.user.name);
              cookie.set("_id_", res.data.user.user_id);
              Router.push("/dashboard");
              wait.close();
            } else {
              wait.close();
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: res.data.message,
              });
            }
          });
      } catch (err) {
        wait.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `SERVER ERROR PLEASE TRY PERMISS THIS SITE <a href="https://server.matchchemicals.com:4008/">server.matchchemicals.com</a>`,
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Pleas Input Email And Password",
      });
    }
  };

  const login = () => {
    return (
      <div className="center">
        <Head>
          <meta charSet="UTF-8" />
          {/* <meta
            http-equiv="Content-Security-Policy"
            content="upgrade-insecure-requests"
          /> */}
          <title>MATCHCHEMICAL</title>
          <link rel="icon" href="/new2.png" />
        </Head>
        <div className="main">
          <div className="login-form">
            <div className="logo-box">
              <img className="logo" src="./new2.png"></img>
            </div>
            <div className="form-box">
              <div className="title">
                <p id="logo">MATCHCHEMICAL</p>
                <p>Sign in</p>
              </div>
              <form onSubmit={handleSubmit}>
                <p style={{ fontWeight: "bold" }}>DateTime: {now}</p>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    className="form-control"
                    type="password"
                    name="email"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="mt-4">
                  <button className="btn-login" type="submit">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };
  if (online) {
    return login();
  } else {
    return (
      <div className="center">
        <h1 style={{ color: "white", fontWeight: "bold" }}>
          PLEASE CONNECT INTERNET
        </h1>
      </div>
    );
  }
};

export default Login;
