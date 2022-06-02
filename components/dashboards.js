import { useTable } from "react-table";
import * as React from "react";
import classnames from "classnames";
import { ResponsiveLine } from "@nivo/line";
import DataExport from "./DataExport";
// import TextField from "@mui/material/TextField";
import { useState } from "react";
import Cookies from "js-cookie";

import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { CSVLink, CSVDownload } from "react-csv";
import { margin } from "@mui/system";
import axios from "axios";
const Swal = require("sweetalert2");

const Dashboards = ({
  boards,
  boardName,
  setBoardId,
  boardId,
  boardData,
  getDeviceDataSave,
  getDeviceDataByType,
  data,
  setData,
  setMonth,
  setYear,
  setDay,
  setDate,
  date,
  setNMonth,
  setBoardData,
  nMonth,
  year,
  day,
}) => {
  const headers = [
    { label: "No.", key: "no" },
    { label: "DEVICE ID", key: "device_id" },
    { label: "DEVICE NAME", key: "name" },
    { label: "DEVICE TEMP", key: "temperature" },
    { label: "DEVICE HUM", key: "humidity" },
    { label: "PH", key: "ph" },
    { label: "PH TEMP", key: "phTemp" },
    { label: "EC", key: "ec" },
    { label: "EC TEMP", key: "ecTemp" },
    { label: "WATER FLOW", key: "waterFlow" },
    { label: "WATER TOTAL", key: "waterTotal" },
    { label: "DATE", key: "date" },
    { label: "TIME", key: "time" },
  ];

  const csv_data = [];
  const exp_data = [];
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
  const server = "https://www.matchchemical.tk:4008/v1";

  const [sDate, setSDate] = useState(new Date(Date.now()));

  const handleDate = (e) => {
    const tmpDate = e.toString();
    const tmpSplit = tmpDate.split(" ");

    setYear(tmpSplit[3]);
    setMonth(tmpSplit[1]);
    setDay(tmpSplit[2]);

    setDate(e);
  };

  const handleSelectDate = async (e) => {
    const tmpDate = e.toString();
    const tmpSplit = tmpDate.split(" ");

    const year = tmpSplit[3];
    const month = tmpSplit[1];
    const day = tmpSplit[2];

    await setSDate(e);
    const wait = Swal.fire({
      title: "PLEASE WAIT!",
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    let nDate = month + " " + day + " " + year;
    try {
      axios
        .get(`${server}/getDeviceDataSave/${boardId}/${String(nDate)}`, {
          headers: {
            "x-access-token": Cookies.get("_t_"),
          },
        })
        .then((res) => {
          wait.close();
          if (res.data.model) {
            setBoardData([]);
            setBoardData(res.data.model);
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: res.data.message,
            });
          }
        });
    } catch (error) {
      console.log(error);
      wait.close();
    }
  };

  return (
    <>
      <div className="dashboard-status">
        <div className="table-box">
          <table className="Table">
            <thead>
              <tr>
                <th className="thead">NO.</th>
                <th className="thead">NAME</th>
                <th className="thead">STATUS</th>
                <th className="thead">BOARD TEMP</th>
                <th className="thead">BOARD HUM</th>
                <th className="thead">PH</th>
                <th className="thead">PH TEMP</th>
                <th className="thead">EC</th>
                <th className="thead">EC TEMP</th>
                <th className="thead">RELAY1 NAME</th>
                <th className="thead">RELAY1 STATUS</th>
                <th className="thead">RELAY2 NAME</th>
                <th className="thead">RELAY2 STATUS</th>
                <th className="thead">RELAY3 NAME</th>
                <th className="thead">RELAY3 STATUS</th>
                <th className="thead">PUMP ALERT</th>
              </tr>
            </thead>
            <tbody>
              {boards.map((i, k) => {
                if (i.ph !== null && i.ec !== null && i.type === "MQTT") {
                  const dateTime = i.time;
                  const now = Date(Date.now);
                  const tmpDT = dateTime.split(" ");
                  const tmpNow = now.split(" ");
                  const nTime = tmpNow[4].toString();
                  const nDay = tmpNow[2].toString();
                  const nYear = tmpNow[3].toString();
                  const nTmpTime = nTime.split(":");
                  const nHour = nTmpTime[0];
                  const nMin = nTmpTime[1];
                  const nSec = nTmpTime[2];
                  const time = tmpDT[4].toString();
                  const day = tmpDT[2].toString();
                  const year = tmpDT[3].toString();
                  const tmpTime = time.split(":");
                  const Hour = tmpTime[0];
                  const Min = tmpTime[1];
                  const Sec = tmpTime[2];
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
                  let nTmpMonth = 0;
                  for (let i = 0; i < Months.length; i++) {
                    if (tmpDT[1] == Months[i]) {
                      tmpMonth = i + 1;
                    }
                    if (tmpNow[1] == Months[i]) {
                      nTmpMonth = i + 1;
                    }
                  }
                  const month = tmpMonth;
                  const nMonth = nTmpMonth;
                  const Disable = !i.online;

                  return (
                    <tr
                      className={classnames("", {
                        P_Alert:
                          (i.valve === 1 && Number(i.flow) === 0) ||
                          (i.valve === 0 && Number(i.flow) > 0),
                      })}
                      onClick={() => getDeviceDataSave(i.device_id, i.name)}
                    >
                      <td>{k + 1}</td>
                      <td>{i.name}</td>
                      <td>
                        {Disable ? (
                          <span className="offline">OFFLINE</span>
                        ) : (
                          <span className="online">ONLINE</span>
                        )}
                      </td>
                      <td>{i.datum.temperature}</td>
                      <td>{i.datum.humidity}</td>
                      <td>{i.datum.ph}</td>
                      <td>{i.datum.phTemp}</td>
                      <td>{i.datum.ec}</td>
                      <td>{i.datum.ecTemp}</td>
                      <td>
                        {
                          i.gpios[
                            i.gpios.findIndex((i) => {
                              return i.index === 0;
                            })
                          ].title
                        }
                      </td>
                      <td>
                        {i.gpios[
                          i.gpios.findIndex((i) => {
                            return i.index === 0;
                          })
                        ].state === false ? (
                          <span className="offline">OFF</span>
                        ) : (
                          <span className="online">ON</span>
                        )}
                      </td>
                      <td>
                        {
                          i.gpios[
                            i.gpios.findIndex((i) => {
                              return i.index === 1;
                            })
                          ].title
                        }
                      </td>
                      <td>
                        {i.gpios[
                          i.gpios.findIndex((i) => {
                            return i.index === 1;
                          })
                        ].state === false ? (
                          <span className="offline">OFF</span>
                        ) : (
                          <span className="online">ON</span>
                        )}
                      </td>
                      <td>
                        {
                          i.gpios[
                            i.gpios.findIndex((i) => {
                              return i.index === 2;
                            })
                          ].title
                        }
                      </td>
                      <td>
                        {i.gpios[
                          i.gpios.findIndex((i) => {
                            return i.index === 2;
                          })
                        ].state === false ? (
                          <span className="offline">OFF</span>
                        ) : (
                          <span className="online">ON</span>
                        )}
                      </td>
                      <td>
                        {(i.valve === 1 && Number(i.flow) === 0) ||
                        (i.valve === 0 && Number(i.flow) > 0) ? (
                          <span className="offline">DANGER</span>
                        ) : (
                          <span className="online">SAVE</span>
                        )}
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </div>

      {boardData.length > 0 || boardData.message ? (
        <>
          <div
            style={{
              textAlign: "center",
              boxShadow: "0px 0px 8px 4px rgba(0, 0, 0, 0.1)",
              margin: "10px",
              padding: "20px",
            }}
          >
            {boardData.length > 0 && (
              <>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="DATE"
                    value={sDate}
                    defaultValue={boardData[0].time}
                    onChange={(e) => {
                      handleSelectDate(e);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </>
            )}
          </div>
          <div className="box-chart">
            <div className="box-ec-chart">
              {boardId !== "" ? (
                boardData.message ? (
                  <h1>{boardData.message}</h1>
                ) : boardData.length !== 0 ? (
                  <>
                    {" "}
                    <div
                      className="dashboard-ec-chart"
                      // style={{
                      //   height: 500,
                      //   boxShadow: "0px 0px 8px 4px rgba(0, 0, 0, 0.1)",
                      //   border: "1px solid white",
                      //   borderRadius: "10px",
                      //   width: "100%",
                      //   display: "flex",
                      //   overflow: "auto",
                      //   justifyContent: "center",

                      //   // width: "70%",
                      // }}
                    >
                      <div className="chart">
                        <THLine
                          boardData={boardData}
                          boardId={boardId}
                          // getBoardData={getBoardData()}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <h1 className="center">
                    <img src="./loading.gif" />
                  </h1>
                )
              ) : (
                <h2>PLEASE SELECT BOARD</h2>
              )}
            </div>
            <div className="box-ec-chart">
              {boardId !== "" ? (
                boardData.message ? (
                  <h1>{boardData.message}</h1>
                ) : boardData.length !== 0 ? (
                  <>
                    {" "}
                    <div
                      className="dashboard-ec-chart"
                      // style={{
                      //   height: 500,
                      //   boxShadow: "0px 0px 8px 4px rgba(0, 0, 0, 0.1)",
                      //   border: "1px solid white",
                      //   borderRadius: "10px",
                      //   width: "100%",
                      //   display: "flex",
                      //   overflow: "auto",
                      //   justifyContent: "center",

                      //   // width: "70%",
                      // }}
                    >
                      <div className="chart">
                        <EcLine
                          boardData={boardData}
                          boardId={boardId}
                          // getBoardData={getBoardData()}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <h1 className="center">
                    <img src="./loading.gif" />
                  </h1>
                )
              ) : (
                <h2>PLEASE SELECT BOARD</h2>
              )}
            </div>
            <div className="box-ec-chart">
              {boardId !== "" ? (
                boardData.message ? (
                  <h1>{boardData.message}</h1>
                ) : boardData.length !== 0 ? (
                  <>
                    <div className="dashboard-ec-chart">
                      <div className="chart">
                        <PhLine
                          boardData={boardData}
                          boardId={boardId}
                          // getBoardData={getBoardData()}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <h1 className="center">
                    <img src="./loading.gif" />
                  </h1>
                )
              ) : (
                <h1>PLEASE SELECT BOARD</h1>
              )}
            </div>
          </div>

          <div className="DataExport">
            <div className="button mb-3">
              <div className="head">
                <h2>EXPORT DATA</h2>
              </div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="DATE"
                  value={date}
                  onChange={(e) => {
                    handleDate(e);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>

              <button
                className="btn"
                disabled={boardData.message}
                onClick={() => {
                  getDeviceDataByType("day");
                }}
              >
                DAY
              </button>
              <button
                className="btn"
                disabled={boardData.message}
                onClick={() => {
                  getDeviceDataByType("month");
                }}
              >
                MONTH
              </button>
              <button
                className="btn"
                disabled={boardData.message}
                onClick={() => {
                  setData([]);
                }}
              >
                CLEAR
              </button>

              {data.length > 0 &&
                data.map((i, k) => {
                  const tmpTime = i.time;
                  const timeSplit = tmpTime.split(" ");
                  const year = timeSplit[3];
                  const time = timeSplit[4];
                  const day = timeSplit[2];
                  let tMonth = 0;
                  let month = "";
                  for (let i = 0; i < Months.length; i++) {
                    if (timeSplit[1] === Months[i]) {
                      tMonth = i + 1;
                    }
                  }
                  month = String(tMonth);
                  if (month.length == 1) {
                    month = String(0) + String(tMonth);
                  } else {
                    month = String(tMonth);
                  }
                  exp_data.push({
                    no: k + 1,
                    device_id: i.deviceId,
                    name: boardName,
                    temperature: i.temperature,
                    humidity: i.humidity,
                    ec: i.ec,
                    ecTemp: i.ecTemp,
                    ph: i.ph,
                    phTemp: i.phTemp,
                    waterFlow: i.waterFlow,
                    waterTotal: i.waterTotal,
                    date: `${year}-${month}-${day}`,
                    time: time,
                  });
                })}

              {data.length > 0 && (
                <button className="btn">
                  <CSVLink
                    // className="btn"
                    style={{ textDecoration: "none", color: "white" }}
                    data={exp_data}
                    filename={`${boardName}_${boardId}_${day}_${nMonth}_${year}.csv`}
                    headers={headers}
                  >
                    Download Excel
                  </CSVLink>
                </button>
              )}
            </div>
            <div className="box-table">
              {boardData.length !== 0 && (
                <>
                  <DataExport
                    key={boardId}
                    data={data}
                    boardId={boardId}
                    boardName={boardName}
                    csv_data={csv_data}
                    Months={Months}
                    setNMonth={setNMonth}
                  />
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="container mt-5" style={{ textAlign: "center" }}>
          <h2>PLEASE SELECT BOARD IN TABLE FOR SHOW DATA</h2>
        </div>
      )}
    </>
  );
};

const EcLine = ({ boardData, boardId }) => {
  const tmpData = boardData;
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
  const TmpLastTime = boardData[0].time;
  const lastTime = TmpLastTime.split(" ");
  let tmpMonth = 0;
  for (let i = 0; i < Months.length; i++) {
    if (lastTime[1] == Months[i]) {
      tmpMonth = i + 1;
    }
  }
  let b_name = "";
  const tmpStartTime = boardData[0].time;
  const tmpStopTime = boardData[boardData.length - 1].time;
  const splitStartTime = tmpStartTime.split(" ");
  const splitStopTime = tmpStopTime.split(" ");
  const starTime = splitStartTime[4];
  const stopTime = splitStopTime[4];

  let dataTmp = [];
  let max = 0;
  let min = 0;
  let sumEc = 0;
  let avgEc = 0;
  for (let i = 0; i < boardData.length; i++) {
    sumEc += Number(boardData[i].ec);
  }

  avgEc = sumEc / boardData.length;
  tmpData.map((i) => {
    if (b_name === "" && i.deviceId === boardId) {
      b_name = i.deviceId;
    }
    if (max === 0) {
      max = Number(i.ec);
    }
    if (min === 0) {
      min = Number(i.ec);
    }
    if (i.ec > max) {
      max = Number(i.ec);
    }
    if (i.ec < min) {
      min = Number(i.ec);
    }
    const tmpTime = i.time;
    const Time = tmpTime.split(" ");
    dataTmp.push({ x: String(Time[4]), y: Number(i.ec) });
  });
  const data = [
    {
      id: b_name,
      color: "hsl(353, 70%, 50%)",
      data: dataTmp,
    },
  ];
  return (
    <>
      <div>
        <h4>
          AVG EC: {Math.floor(avgEc)} MAX: {max} MIN: {min}
        </h4>
        <h5>
          LAST UPDATE {lastTime[2]}/{tmpMonth}/{lastTime[3]}
        </h5>
      </div>
      <div className="lineChart">
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: min - 50,
            max: max + 50,
            stacked: true,
          }}
          yFormat=" >-.2f"
          curve="basis"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -70,
            legend: "",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "EC",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          enableGridX={false}
          enablePoints={false}
          colors={{ scheme: "purple_orange" }}
          pointSize={10}
          // pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          isInteractive={true}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>

      <div className="time">
        <p>{starTime}</p>
        <p>{stopTime}</p>
      </div>
    </>
  );
};

const PhLine = ({ boardData, boardId }) => {
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
  const TmpLastTime = boardData[0].time;
  const lastTime = TmpLastTime.split(" ");
  let tmpMonth = 0;
  for (let i = 0; i < Months.length; i++) {
    if (lastTime[1] == Months[i]) {
      tmpMonth = i + 1;
    }
  }
  const tmpData = boardData;
  let b_name = "";
  const tmpStartTime = boardData[0].time;
  const tmpStopTime = boardData[boardData.length - 1].time;
  const splitStartTime = tmpStartTime.split(" ");
  const splitStopTime = tmpStopTime.split(" ");
  const starTime = splitStartTime[4];
  const stopTime = splitStopTime[4];
  let dataTmp = [];
  let max = 0;
  let sumPh = 0;
  let avgPh = 0;
  for (let i = 0; i < boardData.length; i++) {
    sumPh += Number(boardData[i].ph);
  }

  avgPh = sumPh / boardData.length;
  tmpData.map((i) => {
    if (b_name === "" && i.deviceId === boardId) {
      b_name = i.deviceId;
    }
    if (max === 0) {
      max = Number(i.ph) + 5;
    }
    const tmpTime = i.time;
    const Time = tmpTime.split(" ");
    dataTmp.push({ x: Time[4], y: Number(i.ph) });
  });
  const data = [
    {
      id: b_name,
      color: "hsl(353, 70%, 50%)",
      data: dataTmp,
    },
  ];
  return (
    <>
      <div>
        <h4>AVG PH: {avgPh.toFixed(1)}</h4>
        <h5>
          LAST UPDATE {lastTime[2]}/{tmpMonth}/{lastTime[3]}
        </h5>
      </div>
      <div className="lineChart">
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: 0,
            max: max,
            stacked: false,
            reverse: false,
          }}
          yFormat=" >-.2f"
          curve="basis"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -90,
            legend: "TIME",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "EC",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          enableGridX={false}
          enablePoints={false}
          colors={{ scheme: "purple_orange" }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>

      <div className="time">
        <p>{starTime}</p>
        <p>{stopTime}</p>
      </div>
    </>
  );
};

const THLine = ({ boardData, boardId }) => {
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
  const TmpLastTime = boardData[0].time;
  const lastTime = TmpLastTime.split(" ");
  let tmpMonth = 0;
  for (let i = 0; i < Months.length; i++) {
    if (lastTime[1] == Months[i]) {
      tmpMonth = i + 1;
    }
  }
  const tmpData = boardData;
  let b_name = "";
  const tmpStartTime = boardData[0].time;
  const tmpStopTime = boardData[boardData.length - 1].time;
  const splitStartTime = tmpStartTime.split(" ");
  const splitStopTime = tmpStopTime.split(" ");
  const starTime = splitStartTime[4];
  const stopTime = splitStopTime[4];
  let dataTmp = [];
  let data2Tmp = [];
  let max = 0;
  let min = 0;
  let sumPh = 0;
  let avgPh = 0;
  for (let i = 0; i < boardData.length; i++) {
    sumPh += Number(boardData[i].temperature);
  }

  avgPh = sumPh / boardData.length;
  tmpData.map((i) => {
    if (b_name === "" && i.deviceId === boardId) {
      b_name = i.deviceId;
    }
    if (max === 0) {
      max = Number(i.temperature);
    }
    if (min === 0) {
      min = Number(i.temperature);
    }
    if (i.temperature > max) {
      max = Number(i.temperature);
    }
    if (i.humidity > max) {
      max = Number(i.humidity);
    }
    if (i.humidity < min) {
      min = Number(i.humidity);
    }
    if (i.temperature < min) {
      min = Number(i.temperature);
    }
    const tmpTime = i.time;
    const Time = tmpTime.split(" ");
    dataTmp.push({ x: Time[4], y: Number(i.temperature) });
    data2Tmp.push({ x: Time[4], y: Number(i.humidity) });
  });
  const data = [
    {
      id: "TEMP",
      color: "hsl(353, 70%, 50%)",
      data: dataTmp,
    },
    {
      id: "HUM",
      color: "hsl(353, 70%, 50%)",
      data: data2Tmp,
    },
  ];
  return (
    <>
      <div>
        <h4>
          AVG TEMPERATURE: {avgPh.toFixed(1)} MAX: {max} MIN: {min}
        </h4>
        <h5>
          LAST UPDATE {lastTime[2]}/{tmpMonth}/{lastTime[3]}
        </h5>
      </div>
      <div className="lineChart">
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: min - 5,
            max: max + 5,
            stacked: false,
            reverse: false,
          }}
          yFormat=" >-.2f"
          curve="basis"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -70,
            legend: "",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "TEMPERATURE",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          enableGridX={false}
          enablePoints={false}
          colors={{ scheme: "purple_orange" }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>

      <div className="time">
        <p>{starTime}</p>
        <p>{stopTime}</p>
      </div>
    </>
  );
};

export default Dashboards;
