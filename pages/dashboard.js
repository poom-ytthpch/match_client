import axios from "axios";
import { useEffect, useState } from "react";
import Dashboards from "../components/dashboards";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import Router from "next/router";
import Link from "next/link";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
const Swal = require("sweetalert2");
const server_config = require("../config/config");

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [boardData, setBoardData] = useState([]);
  const [boardId, setBoardId] = useState("");
  const [boardName, setBoardName] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [day, setDay] = useState("");
  const [date, setDate] = useState("");
  const [nMonth, setNMonth] = useState(0);
  // const server = "https://www.matchchemical.tk:57524";
  // const server = "https://boardapi.herokuapp.com";
  // const server = "http://localhost:4003";

  // const server = "http://localhost:4008/v1";
  const server = server_config.host;

  useEffect(() => {
    const Verify = async () => {
      await CookieCheck();
      await getDeviceData();
      // await getBoardCompany();
    };
    const getData = setInterval(() => {
      Verify();
    }, 1000);

    return () => {
      clearInterval(getData);
    };
  }, []);

  const CookieCheck = async () => {
    if (!Cookies.get("_t_")) {
      Object.keys(Cookies.get()).forEach((e) => {
        Cookies.remove(e);
      });
      await Router.push("/login");
    }
  };

  const getDeviceData = async () => {
    try {
      await axios
        .get(`${server}/getDeviceData/${Cookies.get("_id_")}`, {
          headers: {
            "x-access-token": Cookies.get("_t_"),
          },
        })
        .then((res) => {
          setBoards(res.data.model);
          setLoading(false);
        });
    } catch (error) {
      if (error.response.status === 401 || error.response.status === "401") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Token is expired please logout and login again",
        });
      }
      console.log(error);
    }
  };

  const getDeviceDataSave = async (device_id, device_name) => {
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
        .get(`${server}/getDeviceDataSave/${device_id}/non`, {
          headers: {
            "x-access-token": Cookies.get("_t_"),
          },
        })
        .then((res) => {
          setBoardData([]);
          setBoardData(res.data.model);
          setBoardId(device_id);
          setBoardName(device_name);
          wait.close();
        });
    } catch (error) {
      console.log(error);
      wait.close();
    }
  };

  const getDeviceDataByType = async (type) => {
    try {
      if (date !== "") {
        const wait = Swal.fire({
          title: "PLEASE WAIT!",
          timerProgressBar: true,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        await axios
          .post(
            `${server}/getDeviceDataByType`,
            {
              device_id: boardId,
              type: type,
              day: day,
              month: month,
              year: year,
            },
            {
              headers: {
                "x-access-token": Cookies.get("_t_"),
              },
            }
          )
          .then((res) => {
            wait.close();
            setData([]);
            if (res.data.model.length > 0) {
              setData(res.data.model);
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "NO DATA FOUND",
              });
            }
          });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please Select Date",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="center">
          <img src="./loading.gif" />
        </h1>
      </div>
    );
  } else {
    return (
      <div>
        {/* <div className="dashboard-header">
          <p className="mt-2">DEVICE : {boards.length}</p>
        </div> */}
        <div>
          <Dashboards
            key={boardId}
            boards={boards}
            setBoardId={setBoardId}
            getDeviceDataSave={getDeviceDataSave}
            getDeviceDataByType={getDeviceDataByType}
            boardData={boardData}
            setBoardData={setBoardData}
            boardId={boardId}
            boardName={boardName}
            data={data}
            setData={setData}
            setMonth={setMonth}
            setYear={setYear}
            setDay={setDay}
            setDate={setDate}
            date={date}
            setNMonth={setNMonth}
            nMonth={nMonth}
            day={day}
            year={year}
          />
        </div>
      </div>
    );
  }
};

export default Dashboard;
