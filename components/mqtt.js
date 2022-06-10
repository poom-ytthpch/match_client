import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const Swal = require("sweetalert2");
import axios from "axios";
import Cookies from "js-cookie";

// import Select from "react-select";
import { useState, useEffect } from "react";
import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormGroup from "@mui/material/FormGroup";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";

import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styled, useTheme } from "@mui/material/styles";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import { color } from "@mui/system";

// const server = "https://boardapi.herokuapp.com";
// const server = "https://www.matchchemical.tk:57524";
// const server = "http://localhost:4003";

// const server = "http://localhost:4008/v1";
// const server = "https://home420.trueddns.com:57527/v1";
const server = "https://www.matchchemical.tk:4008/v1";

const Mqtt = ({ board }) => {
  if (board.ph !== null || board.ec !== null) {
    const [boardNameStatus, setBoardNameStatus] = useState(false);
    const [boardName, setBoardName] = useState("");
    const [name, setName] = useState("");
    const [relay1TimeStart, setRelay1TimerStart] = useState(true);
    const [relay2TimeStart, setRelay2TimerStart] = useState(true);
    const [relay3TimeStart, setRelay3TimerStart] = useState(true);
    const [relay1TimeStop, setRelay1TimerStop] = useState(true);
    const [relay2TimeStop, setRelay2TimerStop] = useState(true);
    const [relay3TimeStop, setRelay3TimerStop] = useState(true);
    const [relay1Name, setRelay1Name] = useState(false);
    const [relay2Name, setRelay2Name] = useState(false);
    const [relay3Name, setRelay3Name] = useState(false);
    const [relay1Days, setRelay1Days] = useState([]);
    const [relay2Days, setRelay2Days] = useState([]);
    const [relay3Days, setRelay3Days] = useState([]);
    const [tempCheck, setTempCheck] = useState(false);
    const [relay1TimerOpen, setRelay1TimerOpen] = useState(false);
    const [relay2TimerOpen, setRelay2TimerOpen] = useState(false);
    const [relay3TimerOpen, setRelay3TimerOpen] = useState(false);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };

    const updateFanState = async (payload) => {
      const alert = Swal.fire({
        title: "PLEASE WAIT!",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        await axios
          .patch(
            `${server}/updateFanState`,
            {
              device_id: board.device_id,
              fan: payload.fan,
            },
            {
              headers: {
                "x-access-token": Cookies.get("_t_"),
              },
            }
          )
          .then(() => {
            alert.close();
          });
      } catch (error) {
        console.log(error);
        alert.close();
      }
    };

    const updateDeviceName = async (payload) => {
      await setBoardNameStatus(false);
      const alert = Swal.fire({
        title: "PLEASE WAIT!",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        await axios
          .patch(
            `${server}/updateDeviceName`,
            {
              device_id: board.device_id,
              name: String(payload.name),
            },
            {
              headers: {
                "x-access-token": Cookies.get("_t_"),
              },
            }
          )
          .then(() => {
            alert.close();
          });
      } catch (error) {
        console.log(error);
        alert.close();
      }
    };

    const updateGpioName = async (payload) => {
      const alert = Swal.fire({
        title: "PLEASE WAIT!",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      await setRelay1Name(false);
      await setRelay2Name(false);
      await setRelay3Name(false);
      try {
        await axios
          .patch(
            `${server}/updateGpioName`,
            {
              device_id: board.device_id,
              index: Number(payload.index),
              name: String(payload.name),
            },
            {
              headers: {
                "x-access-token": Cookies.get("_t_"),
              },
            }
          )
          .then(() => {
            alert.close();
          });
      } catch (error) {
        console.log(error);
        alert.close();
      }
    };

    const createTimer = async (type, id, payload) => {
      const alert = Swal.fire({
        title: "PLEASE WAIT!",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        switch (type) {
          case "GPIO1":
            if (relay1Days.length !== 0) {
              await axios
                .post(
                  `${server}/createTimer`,
                  {
                    device_id: board.device_id,
                    gpio_id: id,
                    start: payload.start,
                    stop: payload.stop,
                    days: relay1Days,
                  },
                  {
                    headers: {
                      "x-access-token": Cookies.get("_t_"),
                    },
                  }
                )
                .then((result) => {
                  alert.close();
                  if (!result.data.status) {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: result.data.message,
                    });
                  }
                });
            } else {
              alert.close();
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "PLEASE SELECT DAY",
              });
            }

            break;
          case "GPIO2":
            if (relay2Days.length !== 0) {
              await axios
                .post(
                  `${server}/createTimer`,
                  {
                    device_id: board.device_id,
                    gpio_id: id,
                    start: payload.start,
                    stop: payload.stop,
                    days: relay2Days,
                  },
                  {
                    headers: {
                      "x-access-token": Cookies.get("_t_"),
                    },
                  }
                )
                .then((result) => {
                  alert.close();
                  if (!result.data.status) {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: result.data.message,
                    });
                  }
                });
            } else {
              alert.close();
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "PLEASE SELECT DAY",
              });
            }

            break;
          case "GPIO3":
            if (relay3Days.length !== 0) {
              await axios
                .post(
                  `${server}/createTimer`,
                  {
                    device_id: board.device_id,
                    gpio_id: id,
                    start: payload.start,
                    stop: payload.stop,
                    days: relay3Days,
                  },
                  {
                    headers: {
                      "x-access-token": Cookies.get("_t_"),
                    },
                  }
                )
                .then((result) => {
                  alert.close();
                  if (!result.data.status) {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: result.data.message,
                    });
                  }
                });
            } else {
              alert.close();
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "PLEASE SELECT DAY",
              });
            }
            break;
        }
      } catch (error) {
        alert.close();
        console.log(error);
      }
    };

    const deleteTimer = async (timer_id, gpio_id) => {
      const alert = Swal.fire({
        title: "PLEASE WAIT!",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await axios
          .delete(`${server}/deleteTimer/${timer_id}/${gpio_id}`, {
            headers: { "x-access-token": Cookies.get("_t_") },
          })
          .then(() => {
            alert.close();
          });
      } catch (error) {
        console.log(error);
        alert.close();
      }
    };

    const updateGpioData = async (type, id, payload) => {
      const alert = Swal.fire({
        title: "PLEASE WAIT!",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      switch (type) {
        case "PH_STATE":
          await axios
            .patch(
              `${server}/updateGpioData`,
              { device_id: board.device_id, gpio_id: id, phState: payload },
              { headers: { "x-access-token": Cookies.get("_t_") } }
            )
            .then(() => {
              alert.close();
            });
          break;
        case "EC_STATE":
          await axios
            .patch(
              `${server}/updateGpioData`,
              { device_id: board.device_id, gpio_id: id, ecState: payload },
              { headers: { "x-access-token": Cookies.get("_t_") } }
            )
            .then(() => {
              alert.close();
            });
          break;
        case "TIMER_STATE":
          await axios
            .patch(
              `${server}/updateGpioData`,
              { device_id: board.device_id, gpio_id: id, timerState: payload },
              { headers: { "x-access-token": Cookies.get("_t_") } }
            )
            .then(() => {
              alert.close();
            });
          break;
        case "MAX_MIN_PH_STATE":
          await axios
            .patch(
              `${server}/updateGpioData`,
              {
                device_id: board.device_id,
                gpio_id: id,
                maxPh: payload.maxPh,
                minPh: payload.minPh,
              },
              { headers: { "x-access-token": Cookies.get("_t_") } }
            )
            .then(() => {
              alert.close();
            });
          break;
        case "MAX_MIN_EC_STATE":
          await axios
            .patch(
              `${server}/updateGpioData`,
              {
                device_id: board.device_id,
                gpio_id: id,
                maxEc: payload.maxEc,
                minEc: payload.minEc,
              },
              { headers: { "x-access-token": Cookies.get("_t_") } }
            )
            .then(() => {
              alert.close();
            });
          break;
      }

      try {
      } catch (error) {
        console.log(error);
        alert.close();
      }
    };

    const updateSensorState = async (index, state) => {
      const alert = Swal.fire({
        title: "PLEASE WAIT!",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        await axios
          .patch(
            `${server}/updateSensorState`,
            { device_id: board.device_id, index: index, state: state },
            {
              headers: {
                "x-access-token": Cookies.get("_t_"),
              },
            }
          )
          .then(() => {
            alert.close();
          });
      } catch (error) {
        alert.close();
        console.log(error);
      }
    };

    const updateAutoState = async () => {
      try {
        const alert = Swal.fire({
          title: "PLEASE WAIT!",
          timerProgressBar: true,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await axios
          .patch(
            `${server}/updateAutoState`,
            {
              device_id: board.device_id,
              auto: !board.auto,
            },
            {
              headers: {
                "x-access-token": Cookies.get("_t_"),
              },
            }
          )
          .then(() => {
            alert.close();
          });
      } catch (error) {
        console.log(error);
      }
    };

    const updateGpioState = async (index, state) => {
      try {
        const alert = Swal.fire({
          title: "PLEASE WAIT!",
          timerProgressBar: true,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        await axios
          .patch(
            `${server}/updateGpioState`,
            { device_id: board.device_id, index: index, state: state },
            { headers: { "x-access-token": Cookies.get("_t_") } }
          )
          .then(() => {
            alert.close();
          });
      } catch (error) {
        console.log(error);
      }
    };

    /* **************************************************** */

    const handleOpenTimer = async (relay) => {
      switch (Number(relay)) {
        case 1:
          setRelay1TimerOpen(!relay1TimerOpen);
          break;
        case 2:
          setRelay2TimerOpen(!relay2TimerOpen);
          break;
        case 3:
          setRelay3TimerOpen(!relay3TimerOpen);
          break;
      }
    };

    const AllDays = [
      "Everyday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const relayControlTimer = async (
      e,
      device_id,
      status,
      relay,
      type,
      length
    ) => {
      switch (type) {
        case "TIMER_STATUS":
          const alert = Swal.fire({
            title: "PLEASE WAIT!",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          await axios.post(`${server}/dataUpdate`, {
            device_id: device_id,
            dataUpdate: true,
          });
          await axios
            .post(`${server}/relayControlTimer`, {
              device_id: device_id,
              relay: relay,
              status: !status,
              type: type,
            })
            .then(() => {
              alert.close();
            });

          break;

        case "TIMER_SET":
          if (length < 8) {
            const alert = Swal.fire({
              title: "PLEASE WAIT!",
              timerProgressBar: true,
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });

            await axios.post(`${server}/dataUpdate`, {
              device_id: device_id,
              dataUpdate: true,
            });

            switch (relay) {
              case 1:
                if (relay1Days.length < 7) {
                  if (relay1Days.length > 0) {
                    const relay1StartTime =
                      document.getElementById("relay1StartTime").value;
                    const relay1StopTime =
                      document.getElementById("relay1StopTime").value;
                    const relay1StartTimeTmp = relay1StartTime.split(":");
                    const relay1StopTimeTmp = relay1StopTime.split(":");
                    const relay1StartTimeHour = relay1StartTimeTmp[0];
                    const relay1StartTimeMin = relay1StartTimeTmp[1];
                    const relay1StopTimeHour = relay1StopTimeTmp[0];
                    const relay1StopTimeMin = relay1StopTimeTmp[1];
                    let relay1StartTimeNewHour = "";
                    let relay1StartTimeNewMin = "";
                    let relay1StopTimeNewHour = "";
                    let relay1StopTimeNewMin = "";
                    switch (relay1StartTimeHour[0]) {
                      case "0":
                        relay1StartTimeNewHour = relay1StartTimeHour.replace(
                          "0",
                          ""
                        );
                        break;
                      default:
                        relay1StartTimeNewHour = relay1StartTimeHour;
                        break;
                    }
                    switch (relay1StartTimeMin[0]) {
                      case "0":
                        relay1StartTimeNewMin = relay1StartTimeMin.replace(
                          "0",
                          ""
                        );
                        break;
                      default:
                        relay1StartTimeNewMin = relay1StartTimeMin;
                        break;
                    }
                    switch (relay1StopTimeHour[0]) {
                      case "0":
                        relay1StopTimeNewHour = relay1StopTimeHour.replace(
                          "0",
                          ""
                        );
                        break;
                      default:
                        relay1StopTimeNewHour = relay1StopTimeHour;
                        break;
                    }
                    switch (relay1StopTimeMin[0]) {
                      case "0":
                        relay1StopTimeNewMin = relay1StopTimeMin.replace(
                          "0",
                          ""
                        );
                        break;
                      default:
                        relay1StopTimeNewMin = relay1StopTimeMin;
                        break;
                    }
                    const relay1StartTimeNewHM =
                      relay1StartTimeNewHour + ":" + relay1StartTimeNewMin;
                    const relay1StopTimeNewHM =
                      relay1StopTimeNewHour + ":" + relay1StopTimeNewMin;

                    await axios
                      .post(`${server}/relayControlTimer`, {
                        device_id: device_id,
                        type: type,
                        relay: relay,
                        start: relay1TimeStart,
                        stop: relay1TimeStop,
                        startTime: String(relay1StartTimeNewHM),
                        stopTime: String(relay1StopTimeNewHM),
                        aDay: relay1Days,
                      })
                      .then(() => {
                        alert.close();
                      })
                      .catch(function (error) {
                        // handle error
                        alert.close();
                        console.log(error);
                      });
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "PLEASE SELECT DAY",
                    });
                  }
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "PLEASE SELECT EVERYDAY",
                  });
                }
                break;
              case 2:
                if (relay2Days.length < 7) {
                  if (relay2Days.length > 0) {
                    const relay2StartTime =
                      document.getElementById("relay2StartTime").value;
                    const relay2StopTime =
                      document.getElementById("relay2StopTime").value;
                    const relay2StartTimeTmp = relay2StartTime.split(":");
                    const relay2StopTimeTmp = relay2StopTime.split(":");
                    const relay2StartTimeHour = relay2StartTimeTmp[0];
                    const relay2StartTimeMin = relay2StartTimeTmp[1];
                    const relay2StopTimeHour = relay2StopTimeTmp[0];
                    const relay2StopTimeMin = relay2StopTimeTmp[1];
                    let relay2StartTimeNewHour = "";
                    let relay2StartTimeNewMin = "";
                    let relay2StopTimeNewHour = "";
                    let relay2StopTimeNewMin = "";
                    switch (relay2StartTimeHour[0]) {
                      case "0":
                        relay2StartTimeNewHour = relay2StartTimeHour.replace(
                          "0",
                          ""
                        );
                        break;
                      default:
                        relay2StartTimeNewHour = relay2StartTimeHour;
                        break;
                    }
                    switch (relay2StartTimeMin[0]) {
                      case "0":
                        relay2StartTimeNewMin = relay2StartTimeMin.replace(
                          "0",
                          ""
                        );
                        break;
                      default:
                        relay2StartTimeNewMin = relay2StartTimeMin;
                        break;
                    }
                    switch (relay2StopTimeHour[0]) {
                      case "0":
                        relay2StopTimeNewHour = relay2StopTimeHour.replace(
                          "0",
                          ""
                        );
                        break;
                      default:
                        relay2StopTimeNewHour = relay2StopTimeHour;
                        break;
                    }
                    switch (relay2StopTimeMin[0]) {
                      case "0":
                        relay2StopTimeNewMin = relay2StopTimeMin.replace(
                          "0",
                          ""
                        );
                        break;
                      default:
                        relay2StopTimeNewMin = relay2StopTimeMin;
                        break;
                    }
                    const relay2StartTimeNewHM =
                      relay2StartTimeNewHour + ":" + relay2StartTimeNewMin;
                    const relay2StopTimeNewHM =
                      relay2StopTimeNewHour + ":" + relay2StopTimeNewMin;

                    await axios
                      .post(`${server}/relayControlTimer`, {
                        device_id: device_id,
                        type: type,
                        relay: relay,
                        start: relay2TimeStart,
                        stop: relay2TimeStop,
                        startTime: String(relay2StartTimeNewHM),
                        stopTime: String(relay2StopTimeNewHM),
                        aDay: relay2Days,
                      })
                      .then(() => {
                        alert.close();
                      })
                      .catch(function (error) {
                        // handle error
                        alert.close();
                        console.log(error);
                      });
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "PLEASE SELECT DAY",
                    });
                  }
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "PLEASE SELECT EVERYDAY",
                  });
                }
                break;
              case 3:
                if (relay1Days.length < 7) {
                  if (relay3Days.length > 0) {
                    const relay3StartTime =
                      document.getElementById("relay3StartTime").value;
                    const relay3StopTime =
                      document.getElementById("relay3StopTime").value;
                    const relay3StartTimeTmp = relay3StartTime.split(":");
                    const relay3StopTimeTmp = relay3StopTime.split(":");
                    const relay3StartTimeHour = relay3StartTimeTmp[0];
                    const relay3StartTimeMin = relay3StartTimeTmp[1];
                    const relay3StopTimeHour = relay3StopTimeTmp[0];
                    const relay3StopTimeMin = relay3StopTimeTmp[1];
                    let relay3StartTimeNewHour = "";
                    let relay3StartTimeNewMin = "";
                    let relay3StopTimeNewHour = "";
                    let relay3StopTimeNewMin = "";
                    switch (relay3StartTimeHour[0]) {
                      case "0":
                        relay3StartTimeNewHour = relay3StartTimeHour.replace(
                          "0",
                          ""
                        );
                        break;
                      default:
                        relay3StartTimeNewHour = relay3StartTimeHour;
                        break;
                    }
                    switch (relay3StartTimeMin[0]) {
                      case "0":
                        relay3StartTimeNewMin = relay3StartTimeMin.replace(
                          "0",
                          ""
                        );
                        break;
                      default:
                        relay3StartTimeNewMin = relay3StartTimeMin;
                        break;
                    }
                    switch (relay3StopTimeHour[0]) {
                      case "0":
                        relay3StopTimeNewHour = relay3StopTimeHour.replace(
                          "0",
                          ""
                        );
                        break;
                      default:
                        relay3StopTimeNewHour = relay3StopTimeHour;
                        break;
                    }
                    switch (relay3StopTimeMin[0]) {
                      case "0":
                        relay3StopTimeNewMin = relay3StopTimeMin.replace(
                          "0",
                          ""
                        );
                        break;
                      default:
                        relay3StopTimeNewMin = relay3StopTimeMin;
                        break;
                    }
                    const relay3StartTimeNewHM =
                      relay3StartTimeNewHour + ":" + relay3StartTimeNewMin;
                    const relay3StopTimeNewHM =
                      relay3StopTimeNewHour + ":" + relay3StopTimeNewMin;

                    await axios
                      .post(`${server}/relayControlTimer`, {
                        device_id: device_id,
                        type: type,
                        relay: relay,
                        start: relay3TimeStart,
                        stop: relay3TimeStop,
                        startTime: String(relay3StartTimeNewHM),
                        stopTime: String(relay3StopTimeNewHM),
                        aDay: relay3Days,
                      })
                      .then(() => {
                        alert.close();
                      })
                      .catch(function (error) {
                        // handle error
                        alert.close();
                        console.log(error);
                      });
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "PLEASE SELECT DAY",
                    });
                  }
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "PLEASE SELECT EVERYDAY",
                  });
                }
                break;
              default:
                break;
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Max Timer is 8",
            });
          }
          break;

        case "PUMP_RELAY_ALERT":
          const relayNo = document.getElementById("relayAlertRelay").value;
          try {
            if (relayNo < 4 && relayNo > 0) {
              const alert = Swal.fire({
                title: "PLEASE WAIT!",
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => {
                  Swal.showLoading();
                },
              });

              await axios.post(`${server}/dataUpdate`, {
                device_id: device_id,
                dataUpdate: true,
              });

              await axios
                .post(`${server}/relayControlTimer`, {
                  device_id: device_id,
                  type: type,
                  relay: relay,
                  status: relayNo,
                })
                .then(() => {
                  alert.close();
                })
                .catch(function (error) {
                  // handle error
                  alert.close();
                  console.log(error);
                });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "PLEASE INPUT MORE THAN 0 AND EQUAL 3",
              });
            }
          } catch (err) {
            console.log(err);
          }

          break;
      }
    };

    function getStyles(name, day, theme) {
      return {
        fontWeight:
          day.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
      };
    }

    const theme = useTheme();

    const handleRelay1Change = (e) => {
      const {
        target: { value },
      } = e;

      setRelay1Days(typeof value === "string" ? value.split(",") : value);
    };

    const handleRelay2Change = (e) => {
      const {
        target: { value },
      } = e;

      setRelay2Days(typeof value === "string" ? value.split(",") : value);
    };

    const handleRelay3Change = (e) => {
      const {
        target: { value },
      } = e;

      setRelay3Days(typeof value === "string" ? value.split(",") : value);
    };

    const IOSSwitch = styled((props) => (
      <Switch
        focusVisibleClassName=".Mui-focusVisible"
        disableRipple
        {...props}
      />
    ))(({ theme }) => ({
      width: 42,
      height: 26,
      padding: 0,
      "& .MuiSwitch-switchBase": {
        padding: 0,
        margin: 2,
        transitionDuration: "300ms",
        "&.Mui-checked": {
          transform: "translateX(16px)",
          color: "#fff",
          "& + .MuiSwitch-track": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#2ECA45" : "#0ca3dd",
            opacity: 1,
            border: 0,
          },
          "&.Mui-disabled + .MuiSwitch-track": {
            opacity: 0.5,
          },
        },
        "&.Mui-focusVisible .MuiSwitch-thumb": {
          color: "#33cf4d",
          border: "6px solid #fff",
        },
        "&.Mui-disabled .MuiSwitch-thumb": {
          color:
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[600],
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
        },
      },
      "& .MuiSwitch-thumb": {
        boxSizing: "border-box",
        width: 22,
        height: 22,
      },
      "& .MuiSwitch-track": {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
        opacity: 1,
        transition: theme.transitions.create(["background-color"], {
          duration: 500,
        }),
      },
    }));

    const flow = Number(board.flow);
    const dateTime = board.time;
    const now = Date(Date.now);
    const tmpDT = dateTime.split(" ");
    const tmpNow = now.split(" ");
    const relay1Timers = board.relay1Timers;
    const bclTimer = board.bclTimers;
    const device_id = board.device_id;
    const WFlow = Number(board.flow);
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
    const Disable = !board.online;

    return (
      <div>
        <div
          className={`board ${Disable ? "B_offline" : "B_online"}`}
          key={device_id}
        >
          <div className="mb-3 ">
            <div className="board-header">
              <p className="board-title">
                NAME:{" "}
                {boardNameStatus ? (
                  <div className="mb-3 container set-name">
                    <input
                      className="form-control"
                      type="text"
                      defaultValue={board.name}
                      onChange={(e) => {
                        setBoardName(e.target.value);
                      }}
                    ></input>
                    <div>
                      <button
                        className="btn btn-outline-success mt-2"
                        onClick={() => updateDeviceName({ name: boardName })}
                      >
                        SET
                      </button>
                      <button
                        className="btn btn-outline-danger mt-2"
                        onClick={() => {
                          setBoardNameStatus(!boardNameStatus);
                        }}
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  <span
                    className="board-name"
                    onClick={() => {
                      setBoardNameStatus(!boardNameStatus);
                    }}
                  >
                    {board.name.toUpperCase()}
                  </span>
                )}
              </p>
              <p className="board-status">
                STATUS:{" "}
                {Disable ? (
                  <span className="offline">OFFLINE</span>
                ) : (
                  <span className="online">ONLINE</span>
                )}
              </p>

              <p className="time-box">
                Last Time Update:{" "}
                <span className="time">
                  {day}/{month}/{year} {Hour}:{Min}:{Sec}
                </span>
              </p>
              <p className="time-box">
                ID: <span className="time">{board.device_id}</span> VERSION:{" "}
                <span className="time">{board.current}</span>
              </p>
              <div>
                {!board.auto && (
                  <div className="alert">
                    <span>AUTO DISABLE</span>
                  </div>
                )}
                <FormControlLabel
                  control={
                    <IOSSwitch
                      sx={{ m: 1 }}
                      checked={board.auto}
                      onChange={(e) => updateAutoState()}
                    />
                  }
                  disabled={Disable}
                  label="AUTO"
                />
                <FormControlLabel
                  control={
                    <IOSSwitch
                      sx={{ m: 1 }}
                      checked={board.fan}
                      onChange={(e) => updateFanState({ fan: !board.fan })}
                    />
                  }
                  disabled={Disable}
                  label="FAN"
                />
              </div>
            </div>

            <div className="board-box">
              {/* /***************BOARD TEMP PROGRESS*********************/}

              <div>
                <p className="title">TEMP</p>

                <FormControlLabel
                  control={
                    <IOSSwitch
                      sx={{ m: 1 }}
                      checked={
                        board.sensors[
                          board.sensors.findIndex((i) => {
                            return i.index === 5;
                          })
                        ].state
                      }
                      onChange={(e) =>
                        updateSensorState(
                          5,
                          !board.sensors[
                            board.sensors.findIndex((i) => {
                              return i.index === 5;
                            })
                          ].state
                        )
                      }
                    />
                  }
                  disabled={Disable}
                  label="TH SENSOR"
                />

                <div className="progress-box">
                  <CircularProgressbar
                    value={board.datum.temperature}
                    maxValue={100}
                    circleRatio={0.7}
                    styles={{
                      trail: {
                        strokeLinecap: "butt",
                        transform: "rotate(-126deg)",
                        transformOrigin: "center center",
                      },

                      path: {
                        strokeLinecap: "butt",
                        transform: "rotate(-126deg)",
                        transformOrigin: "center center",
                        stroke: "#5c459b",
                      },
                      text: {
                        fill: "#05ace3",
                        fontSize: "12px",
                      },
                    }}
                    strokeWidth={10}
                    text={`${board.datum.temperature} *c`}
                  />
                </div>
                {board.fan ? (
                  <>
                    {" "}
                    <span style={{ color: "green" }}>FAN START</span>
                    <br></br>
                  </>
                ) : (
                  <>
                    {" "}
                    <span style={{ color: "red" }}>FAN STOP</span>
                    <br></br>
                  </>
                )}
              </div>

              {/* /***************BOARD HUM PROGRESS*********************/}

              <div>
                <span className="title">HUM</span>
                <br></br>
                <br></br>
                <br></br>
                <div className="progress-box">
                  <CircularProgressbar
                    value={board.datum.humidity}
                    maxValue={100}
                    circleRatio={0.7}
                    styles={{
                      trail: {
                        strokeLinecap: "butt",
                        transform: "rotate(-126deg)",
                        transformOrigin: "center center",
                      },

                      path: {
                        strokeLinecap: "butt",
                        transform: "rotate(-126deg)",
                        transformOrigin: "center center",
                        stroke: "#5c459b",
                      },
                      text: {
                        fill: "#05ace3",
                        fontSize: "12px",
                      },
                    }}
                    strokeWidth={10}
                    text={`${board.datum.humidity} %`}
                  />
                </div>
              </div>

              {/* /***************PH PROGRESS*********************/}

              <div>
                <span className="title">PH</span>
                <div>
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        sx={{ m: 1 }}
                        checked={
                          board.sensors[
                            board.sensors.findIndex((i) => {
                              return i.index === 1;
                            })
                          ]
                            ? board.sensors[
                                board.sensors.findIndex((i) => {
                                  return i.index === 1;
                                })
                              ].state
                            : false
                        }
                        onChange={(e) =>
                          updateSensorState(
                            1,
                            !board.sensors[
                              board.sensors.findIndex((i) => {
                                return i.index === 1;
                              })
                            ].state
                          )
                        }
                      />
                    }
                    disabled={Disable}
                    label="PH SENSOR"
                  />
                </div>

                <div className="progress-box">
                  <CircularProgressbar
                    value={board.datum.ph}
                    maxValue={14}
                    circleRatio={0.7}
                    styles={{
                      trail: {
                        strokeLinecap: "butt",
                        transform: "rotate(-126deg)",
                        transformOrigin: "center center",
                      },

                      path: {
                        strokeLinecap: "butt",
                        transform: "rotate(-126deg)",
                        transformOrigin: "center center",
                        stroke: "#5c459b",
                      },
                      text: {
                        fill: "#05ace3",
                        fontSize: "12px",
                      },
                    }}
                    strokeWidth={10}
                    text={`${board.datum.ph} pH`}
                  />
                </div>
              </div>
              {/* /***************PH TEMP PROGRESS*********************/}

              <div>
                <span className="title">PH TEMP</span>
                <br></br>
                <br></br>
                <br></br>
                <div className="progress-box">
                  <CircularProgressbar
                    value={board.datum.phTemp}
                    maxValue={100}
                    circleRatio={0.7}
                    styles={{
                      trail: {
                        strokeLinecap: "butt",
                        transform: "rotate(-126deg)",
                        transformOrigin: "center center",
                      },

                      path: {
                        strokeLinecap: "butt",
                        transform: "rotate(-126deg)",
                        transformOrigin: "center center",
                        stroke: "#5c459b",
                      },
                      text: {
                        fill: "#05ace3",
                        fontSize: "12px",
                      },
                    }}
                    strokeWidth={10}
                    text={`${board.datum.phTemp} *c`}
                  />
                </div>
              </div>

              {/* /***************EC PROGRESS*********************/}

              <div>
                <p className="title">EC</p>
                <div>
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        sx={{ m: 1 }}
                        checked={
                          board.sensors[
                            board.sensors.findIndex((i) => {
                              return i.index === 2;
                            })
                          ]
                            ? board.sensors[
                                board.sensors.findIndex((i) => {
                                  return i.index === 2;
                                })
                              ].state
                            : false
                        }
                        onChange={(e) =>
                          updateSensorState(
                            2,
                            !board.sensors[
                              board.sensors.findIndex((i) => {
                                return i.index === 2;
                              })
                            ].state
                          )
                        }
                      />
                    }
                    disabled={Disable}
                    label="EC SENSOR"
                  />
                </div>
                <div className="progress-box">
                  <CircularProgressbar
                    value={board.datum.ec}
                    maxValue={10000}
                    circleRatio={0.7}
                    styles={{
                      trail: {
                        strokeLinecap: "butt",
                        transform: "rotate(-126deg)",
                        transformOrigin: "center center",
                      },

                      path: {
                        strokeLinecap: "butt",
                        transform: "rotate(-126deg)",
                        transformOrigin: "center center",
                        stroke: "#5c459b",
                      },
                      text: {
                        fill: "#05ace3",
                        fontSize: "12px",
                      },
                    }}
                    strokeWidth={10}
                    text={`${board.datum.ec} us`}
                  />
                </div>
              </div>
              {/* /***************EC TEMP PROGRESS*********************/}

              <div>
                <span className="title">EC TEMP</span>
                <br></br>
                <br></br>
                <br></br>
                <div className="progress-box">
                  <CircularProgressbar
                    value={board.datum.ecTemp}
                    maxValue={100}
                    circleRatio={0.7}
                    styles={{
                      trail: {
                        strokeLinecap: "butt",
                        transform: "rotate(-126deg)",
                        transformOrigin: "center center",
                      },

                      path: {
                        strokeLinecap: "butt",
                        transform: "rotate(-126deg)",
                        transformOrigin: "center center",
                        stroke: "#5c459b",
                      },
                      text: {
                        fill: "#05ace3",
                        fontSize: "12px",
                      },
                    }}
                    strokeWidth={10}
                    text={`${board.datum.ecTemp} *c`}
                  />
                </div>
              </div>
              {/* /***************WATER FLOW PROGRESS*********************/}

              <div>
                <p className="title">WATER FLOW</p>
                <div>
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        sx={{ m: 1 }}
                        checked={board.waterFlowInput}
                        onChange={(e) =>
                          handleSensorInput(
                            e.preventDefault(),
                            device_id,
                            "WATER_FLOW_SENSOR",
                            board.waterFlowInput
                          )
                        }
                      />
                    }
                    disabled={true}
                    label={`WF SENSOR`}
                  />
                </div>

                <div className="progress-box">
                  <CircularProgressbar
                    value={board.datum.waterFlow}
                    maxValue={100}
                    circleRatio={0.7}
                    styles={{
                      trail: {
                        strokeLinecap: "butt",
                        transform: "rotate(-126deg)",
                        transformOrigin: "center center",
                      },

                      path: {
                        strokeLinecap: "butt",
                        transform: "rotate(-126deg)",
                        transformOrigin: "center center",
                        stroke: "#5c459b",
                      },
                      text: {
                        fill: "#05ace3",
                        fontSize: "12px",
                      },
                    }}
                    strokeWidth={10}
                    text={`${board.datum.waterFlow} l/h `}
                  />
                </div>
                {board.datum.waterFlow > 0 ? (
                  <span style={{ color: "green" }}>Water Flowing</span>
                ) : (
                  <span style={{ color: "red" }}>Water Not Flow</span>
                )}
              </div>
              {/* /***************WATER TOTAL PROGRESS*********************/}

              <div>
                <p className="title">WATER TOTAL</p>
                <br />
                <div className="progress-box">
                  <CircularProgressbar
                    value={board.datum.waterTotal}
                    maxValue={1000}
                    circleRatio={0.7}
                    styles={{
                      trail: {
                        strokeLinecap: "butt",
                        transform: "rotate(-126deg)",
                        transformOrigin: "center center",
                      },

                      path: {
                        strokeLinecap: "butt",
                        transform: "rotate(-126deg)",
                        transformOrigin: "center center",
                        stroke: "#5c459b",
                      },
                      text: {
                        fill: "#05ace3",
                        fontSize: "12px",
                      },
                    }}
                    strokeWidth={10}
                    text={`${board.datum.waterTotal} l\n`}
                  />
                </div>
              </div>
            </div>

            <div className="button-box">
              {/* /***************RELAY1*********************/}
              <div className="box">
                <div className="box-title">
                  {relay1Name ? (
                    <div className="mb-3 set-name">
                      <input
                        className="form-control"
                        type="text"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 0;
                            })
                          ].title
                        }
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      ></input>
                      <button
                        className="btn btn-outline-success mt-2"
                        onClick={() =>
                          updateGpioName({
                            index:
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 0;
                                })
                              ].index,
                            name: name,
                          })
                        }
                      >
                        SET
                      </button>
                      <button
                        className="btn btn-outline-danger mt-2"
                        onClick={() => {
                          setRelay1Name(!relay1Name);
                        }}
                      >
                        CANCEL
                      </button>
                    </div>
                  ) : (
                    <p
                      className="button-title"
                      onClick={() => {
                        setRelay1Name(!relay1Name);
                      }}
                    >
                      {
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 0;
                          })
                        ].title
                      }
                    </p>
                  )}

                  {board.gpios[
                    board.gpios.findIndex((i) => {
                      return i.index === 0;
                    })
                  ].gpio_datum.phState ? (
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 0;
                      })
                    ].gpio_datum.maxPh >
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 0;
                      })
                    ].gpio_datum.minPh ? (
                      board.datum.ph >=
                      board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 0;
                        })
                      ].gpio_datum.maxPh ? (
                        <div className="alert">
                          <span>PH ALERT</span>
                        </div>
                      ) : (
                        <></>
                      )
                    ) : board.datum.ph <=
                      board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 0;
                        })
                      ].gpio_datum.maxPh ? (
                      <div className="alert">
                        <span>PH ALERT</span>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {board.gpios[
                    board.gpios.findIndex((i) => {
                      return i.index === 0;
                    })
                  ].gpio_datum.ecState ? (
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 0;
                      })
                    ].gpio_datum.maxEc >
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 0;
                      })
                    ].gpio_datum.minEc ? (
                      board.datum.ec >=
                      board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 0;
                        })
                      ].gpio_datum.maxEc ? (
                        <div className="alert">
                          <span>EC ALERT</span>
                        </div>
                      ) : (
                        <></>
                      )
                    ) : board.datum.ec <=
                      board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 0;
                        })
                      ].gpio_datum.maxEc ? (
                      <div className="alert">
                        <span>EC ALERT</span>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {(Boolean(
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 0;
                      })
                    ]
                  )
                    ? board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 0;
                        })
                      ].state
                    : false) === false ? (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => updateGpioState(0, 1)}
                      disabled={
                        Disable ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 0;
                          })
                        ].gpio_datum.phState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 0;
                          })
                        ].gpio_datum.ecState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 0;
                          })
                        ].gpio_datum.timerState
                      }
                    >
                      OFF
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-success blynk"
                      onClick={() => updateGpioState(0, 0)}
                      disabled={
                        Disable ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 0;
                          })
                        ].gpio_datum.phState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 0;
                          })
                        ].gpio_datum.ecState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 0;
                          })
                        ].gpio_datum.timerState
                      }
                    >
                      ON
                    </button>
                  )}
                  {/* ******************* SWITCH ******************* */}

                  <div className="Switch mt-3">
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 0;
                              })
                            ].gpio_datum.phState
                          }
                          onChange={(e) =>
                            updateGpioData(
                              "PH_STATE",
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 0;
                                })
                              ].id,
                              !board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 0;
                                })
                              ].gpio_datum.phState,
                              e.preventDefault()
                            )
                          }
                        />
                      }
                      disabled={
                        Disable ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 0;
                          })
                        ].gpio_datum.timerState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 0;
                          })
                        ].gpio_datum.ecState
                      }
                      label="PH"
                    />

                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 0;
                              })
                            ].gpio_datum.ecState
                          }
                          onChange={(e) =>
                            updateGpioData(
                              "EC_STATE",
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 0;
                                })
                              ].id,
                              !board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 0;
                                })
                              ].gpio_datum.ecState,
                              e.preventDefault()
                            )
                          }
                        />
                      }
                      disabled={
                        Disable ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 0;
                          })
                        ].gpio_datum.phState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 0;
                          })
                        ].gpio_datum.timerState
                      }
                      label="EC"
                    />

                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 0;
                              })
                            ].gpio_datum.timerState
                          }
                          onChange={(e) =>
                            updateGpioData(
                              "TIMER_STATE",
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 0;
                                })
                              ].id,
                              !board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 0;
                                })
                              ].gpio_datum.timerState,
                              e.preventDefault()
                            )
                          }
                        />
                      }
                      disabled={
                        Disable ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 0;
                          })
                        ].gpio_datum.phState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 0;
                          })
                        ].gpio_datum.ecState
                      }
                      label="TIMER"
                    />
                  </div>
                </div>
                {/* ******************* Ph ******************* */}
                {board.gpios[
                  board.gpios.findIndex((i) => {
                    return i.index === 0;
                  })
                ].gpio_datum.phState && (
                  <form className="mt-3 box-form">
                    <p>PH</p>
                    <div className="mb-3">
                      <label>START:</label>
                      <input
                        id="relay1PhStart"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 0;
                            })
                          ].gpio_datum.maxPh
                        }
                        className="form-input"
                        type="number"
                        min="0"
                        max="14"
                        style={{ color: "white" }}
                        disabled={Disable}
                      ></input>
                    </div>
                    <div className="mb-3">
                      <label>STOP:</label>
                      <input
                        id="relay1PhStop"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 0;
                            })
                          ].gpio_datum.minPh
                        }
                        className="form-input"
                        type="number"
                        min="0"
                        max="14"
                        style={{ color: "white" }}
                        disabled={Disable}
                      ></input>
                    </div>
                    <div>
                      <button
                        id="set"
                        disabled={Disable}
                        onClick={(e) =>
                          updateGpioData(
                            "MAX_MIN_PH_STATE",
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 0;
                              })
                            ].id,
                            {
                              maxPh: Number(
                                document.getElementById("relay1PhStart").value
                              ),
                              minPh: Number(
                                document.getElementById("relay1PhStop").value
                              ),
                            },
                            e.preventDefault()
                          )
                        }
                      >
                        SET
                      </button>
                    </div>
                  </form>
                )}

                {/* ******************* EC ******************* */}

                {board.gpios[
                  board.gpios.findIndex((i) => {
                    return i.index === 0;
                  })
                ].gpio_datum.ecState && (
                  <form className="mt-3 box-form">
                    <p>EC</p>
                    <div className="mb-3">
                      <label>START:</label>
                      <input
                        id="relay1EcStart"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 0;
                            })
                          ].gpio_datum.maxEc
                        }
                        className="form-input"
                        type="number"
                        min="0"
                        max="10000"
                        style={{ color: "white" }}
                        disabled={Disable}
                      ></input>
                    </div>
                    <div className="mb-3">
                      <label>STOP:</label>
                      <input
                        id="relay1EcStop"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 0;
                            })
                          ].gpio_datum.minEc
                        }
                        className="form-input"
                        type="number"
                        min="0"
                        max="10000"
                        style={{ color: "white" }}
                        disabled={Disable}
                      ></input>
                    </div>
                    <div>
                      <button
                        id="set"
                        disabled={Disable}
                        onClick={(e) =>
                          updateGpioData(
                            "MAX_MIN_EC_STATE",
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 0;
                              })
                            ].id,
                            {
                              maxEc: Number(
                                document.getElementById("relay1EcStart").value
                              ),
                              minEc: Number(
                                document.getElementById("relay1EcStop").value
                              ),
                            },
                            e.preventDefault()
                          )
                        }
                      >
                        SET
                      </button>
                    </div>
                  </form>
                )}

                {/* ******************* Timer ******************* */}
                {board.gpios[
                  board.gpios.findIndex((i) => {
                    return i.index === 0;
                  })
                ].gpio_datum.timerState && (
                  <>
                    <form className="mt-3 box-form">
                      <p>Timer</p>

                      <div className="mb-3">
                        <div className="form-group mb-3 timer-set">
                          <p>DAYS</p>
                          <FormControl
                            sx={{
                              mb: 2,
                              width: "100%",
                              maxWidth: "250px",
                              outlineColor: "#FFFF",
                            }}
                          >
                            <InputLabel
                              id="demo-multiple-name-label"
                              style={{ color: "white" }}
                            >
                              DAYS
                            </InputLabel>
                            <Select
                              labelId="demo-multiple-name-label"
                              id="demo-multiple-name"
                              multiple
                              style={{ color: "white" }}
                              value={relay1Days}
                              onChange={handleRelay1Change}
                              input={<OutlinedInput label="Name" />}
                              MenuProps={MenuProps}
                            >
                              {AllDays.map((name) => (
                                <MenuItem
                                  key={name}
                                  value={name}
                                  style={getStyles(name, relay1Days, theme)}
                                >
                                  {name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>

                        <div className="mb-3 mt-3 timer-set">
                          <p>START TIME</p>
                          <div>
                            <Box
                              component="form"
                              sx={{
                                "& .MuiTextField-root": {
                                  color: "white",
                                },
                              }}
                              noValidate
                              autoComplete="off"
                            >
                              <div>
                                <TextField
                                  fullWidth
                                  style={{ color: " #ffffff" }}
                                  id="relay1StartTime"
                                  label="START TIME"
                                  variant="outlined"
                                  defaultValue={nHour + ":" + nMin}
                                  type="time"
                                  disabled={Disable}
                                  inputProps={{
                                    style: {
                                      color: "white",
                                    },
                                  }}
                                />
                              </div>
                            </Box>
                          </div>

                          {/* <input
                                      id="valveStartTime"
                                      className="form-input"
                                      defaultValue={nHour + ":" + nMin}
                                      type="time"
                                      style={{ color: "white" }}
                                      disabled={Disable}
                                    ></input> */}
                        </div>

                        <div className="mb-3 timer-set">
                          <p>STOP TIME</p>
                          <div>
                            <Box
                              component="form"
                              sx={{
                                "& .MuiTextField-root": {
                                  color: "white",
                                },
                              }}
                              noValidate
                              autoComplete="off"
                            >
                              <div>
                                <TextField
                                  fullWidth
                                  style={{ color: " #ffffff" }}
                                  id="relay1StopTime"
                                  label="STOP TIME"
                                  variant="outlined"
                                  defaultValue={nHour + ":" + nMin}
                                  type="time"
                                  disabled={Disable}
                                  inputProps={{
                                    style: {
                                      color: "white",
                                    },
                                  }}
                                />
                              </div>
                            </Box>
                          </div>
                          {/* <input
                                      id="valveStopTime"
                                      className="form-input"
                                      defaultValue={nHour + ":" + nMin}
                                      type="time"
                                      style={{ color: "white" }}
                                      disabled={Disable}
                                    ></input> */}
                        </div>
                      </div>
                      <div>
                        <button
                          id="set"
                          onClick={(e) =>
                            createTimer(
                              "GPIO1",
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 0;
                                })
                              ].id,
                              {
                                start: String(
                                  document.getElementById("relay1StartTime")
                                    .value
                                ),
                                stop: String(
                                  document.getElementById("relay1StopTime")
                                    .value
                                ),
                              },
                              e.preventDefault()
                            )
                          }
                          disabled={Disable}
                        >
                          SET
                        </button>
                        {board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 0;
                          })
                        ].timers.length > 0 && (
                          <button
                            id="set"
                            className="mt-2"
                            onClick={(e) => {
                              handleOpenTimer(1, e.preventDefault());
                            }}
                          >
                            SHOW TIMER :
                            {
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 0;
                                })
                              ].timers.length
                            }
                          </button>
                        )}
                      </div>
                    </form>

                    <Dialog
                      open={relay1TimerOpen}
                      // onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        <h2>
                          TIMER{" "}
                          {
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 0;
                              })
                            ].title
                          }
                        </h2>
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          <table className="table table-hover table-dark">
                            <thead>
                              <tr style={{ textAlign: "center" }}>
                                <th>TIMER</th>
                                <th>START TIME</th>
                                <th>STOP TIME</th>
                                <th>DAYS</th>
                                <th>DELETE</th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                              {board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 0;
                                })
                              ].timers.map((timer, k) => {
                                return (
                                  <tr key={timer.id}>
                                    <td>{k + 1}</td>
                                    <td>{timer.start}</td>
                                    <td>{timer.stop}</td>
                                    <td>
                                      {timer.days.map((j, k) => {
                                        return (
                                          <>
                                            {timer.days.length > 1 ? (
                                              k === timer.days.length - 1 ? (
                                                <span>{j.day}</span>
                                              ) : (
                                                <span>{j.day},</span>
                                              )
                                            ) : (
                                              <span>{j.day}</span>
                                            )}
                                          </>
                                        );
                                      })}
                                    </td>
                                    <td>
                                      {" "}
                                      <div className="timer-button">
                                        <button
                                          className="btn btn-outline-danger"
                                          onClick={(e) =>
                                            deleteTimer(
                                              timer.id,
                                              timer.gpioId,
                                              e.preventDefault()
                                            )
                                          }
                                          disabled={Disable}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          {/* {board.relay1Timers.map((i,k)=>{
                            return(

                            )
                          })} */}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => handleOpenTimer(1)}>
                          CLOSE
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )}
              </div>
              {/* /******************************************/}
              {/* /***************RELAY2*********************/}
              <div className="box">
                <div className="box-title">
                  {relay2Name ? (
                    <div className="mb-3 set-name">
                      <input
                        className="form-control"
                        type="text"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 1;
                            })
                          ].title
                        }
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      ></input>
                      <button
                        className="btn btn-outline-success mt-2"
                        onClick={() =>
                          updateGpioName({
                            index:
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 1;
                                })
                              ].index,
                            name: name,
                          })
                        }
                      >
                        SET
                      </button>
                      <button
                        className="btn btn-outline-danger mt-2"
                        onClick={() => {
                          setRelay2Name(!relay2Name);
                        }}
                      >
                        CANCEL
                      </button>
                    </div>
                  ) : (
                    <p
                      className="button-title"
                      onClick={() => {
                        setRelay2Name(!relay2Name);
                      }}
                    >
                      {
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 1;
                          })
                        ].title
                      }
                    </p>
                  )}

                  {board.gpios[
                    board.gpios.findIndex((i) => {
                      return i.index === 1;
                    })
                  ].gpio_datum.phState ? (
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 1;
                      })
                    ].gpio_datum.maxPh >
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 1;
                      })
                    ].gpio_datum.minPh ? (
                      board.datum.ph >=
                      board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 1;
                        })
                      ].gpio_datum.maxPh ? (
                        <div className="alert">
                          <span>PH ALERT</span>
                        </div>
                      ) : (
                        <></>
                      )
                    ) : board.datum.ph <=
                      board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 1;
                        })
                      ].gpio_datum.maxPh ? (
                      <div className="alert">
                        <span>PH ALERT</span>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {board.gpios[
                    board.gpios.findIndex((i) => {
                      return i.index === 1;
                    })
                  ].gpio_datum.ecState ? (
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 1;
                      })
                    ].gpio_datum.maxEc >
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 1;
                      })
                    ].gpio_datum.minEc ? (
                      board.datum.ec >=
                      board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 1;
                        })
                      ].gpio_datum.maxEc ? (
                        <div className="alert">
                          <span>EC ALERT</span>
                        </div>
                      ) : (
                        <></>
                      )
                    ) : board.datum.ec <=
                      board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 1;
                        })
                      ].gpio_datum.maxEc ? (
                      <div className="alert">
                        <span>EC ALERT</span>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {(Boolean(
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 1;
                      })
                    ]
                  )
                    ? board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 1;
                        })
                      ].state
                    : false) === false ? (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => updateGpioState(1, 1)}
                      disabled={
                        Disable ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 1;
                          })
                        ].gpio_datum.phState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 1;
                          })
                        ].gpio_datum.ecState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 1;
                          })
                        ].gpio_datum.timerState
                      }
                    >
                      OFF
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-success blynk"
                      onClick={() => updateGpioState(1, 0)}
                      disabled={
                        Disable ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 1;
                          })
                        ].gpio_datum.phState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 1;
                          })
                        ].gpio_datum.ecState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 1;
                          })
                        ].gpio_datum.timerState
                      }
                    >
                      ON
                    </button>
                  )}
                  {/* ******************* SWITCH ******************* */}

                  <div className="Switch mt-3">
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 1;
                              })
                            ].gpio_datum.phState
                          }
                          onChange={(e) =>
                            updateGpioData(
                              "PH_STATE",
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 1;
                                })
                              ].id,
                              !board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 1;
                                })
                              ].gpio_datum.phState,
                              e.preventDefault()
                            )
                          }
                        />
                      }
                      disabled={
                        Disable ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 1;
                          })
                        ].gpio_datum.timerState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 1;
                          })
                        ].gpio_datum.ecState
                      }
                      label="PH"
                    />

                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 1;
                              })
                            ].gpio_datum.ecState
                          }
                          onChange={(e) =>
                            updateGpioData(
                              "EC_STATE",
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 1;
                                })
                              ].id,
                              !board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 1;
                                })
                              ].gpio_datum.ecState,
                              e.preventDefault()
                            )
                          }
                        />
                      }
                      disabled={
                        Disable ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 1;
                          })
                        ].gpio_datum.phState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 1;
                          })
                        ].gpio_datum.timerState
                      }
                      label="EC"
                    />

                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 1;
                              })
                            ].gpio_datum.timerState
                          }
                          onChange={(e) =>
                            updateGpioData(
                              "TIMER_STATE",
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 1;
                                })
                              ].id,
                              !board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 1;
                                })
                              ].gpio_datum.timerState,
                              e.preventDefault()
                            )
                          }
                        />
                      }
                      disabled={
                        Disable ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 1;
                          })
                        ].gpio_datum.phState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 1;
                          })
                        ].gpio_datum.ecState
                      }
                      label="TIMER"
                    />
                  </div>
                </div>
                {/* ******************* Ph ******************* */}
                {board.gpios[
                  board.gpios.findIndex((i) => {
                    return i.index === 1;
                  })
                ].gpio_datum.phState && (
                  <form className="mt-3 box-form">
                    <p>PH</p>
                    <div className="mb-3">
                      <label>START:</label>
                      <input
                        id="relay2PhStart"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 1;
                            })
                          ].gpio_datum.maxPh
                        }
                        className="form-input"
                        type="number"
                        min="0"
                        max="14"
                        style={{ color: "white" }}
                        disabled={Disable}
                      ></input>
                    </div>
                    <div className="mb-3">
                      <label>STOP:</label>
                      <input
                        id="relay2PhStop"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 1;
                            })
                          ].gpio_datum.minPh
                        }
                        className="form-input"
                        type="number"
                        min="0"
                        max="14"
                        style={{ color: "white" }}
                        disabled={Disable}
                      ></input>
                    </div>
                    <div>
                      <button
                        id="set"
                        disabled={Disable}
                        onClick={(e) =>
                          updateGpioData(
                            "MAX_MIN_PH_STATE",
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 1;
                              })
                            ].id,
                            {
                              maxPh: Number(
                                document.getElementById("relay2PhStart").value
                              ),
                              minPh: Number(
                                document.getElementById("relay2PhStop").value
                              ),
                            },
                            e.preventDefault()
                          )
                        }
                      >
                        SET
                      </button>
                    </div>
                  </form>
                )}

                {/* ******************* EC ******************* */}

                {board.gpios[
                  board.gpios.findIndex((i) => {
                    return i.index === 1;
                  })
                ].gpio_datum.ecState && (
                  <form className="mt-3 box-form">
                    <p>EC</p>
                    <div className="mb-3">
                      <label>START:</label>
                      <input
                        id="relay2EcStart"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 1;
                            })
                          ].gpio_datum.maxEc
                        }
                        className="form-input"
                        type="number"
                        min="0"
                        max="10000"
                        style={{ color: "white" }}
                        disabled={Disable}
                      ></input>
                    </div>
                    <div className="mb-3">
                      <label>STOP:</label>
                      <input
                        id="relay2EcStop"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 1;
                            })
                          ].gpio_datum.minEc
                        }
                        className="form-input"
                        type="number"
                        min="0"
                        max="10000"
                        style={{ color: "white" }}
                        disabled={Disable}
                      ></input>
                    </div>
                    <div>
                      <button
                        id="set"
                        disabled={Disable}
                        onClick={(e) =>
                          updateGpioData(
                            "MAX_MIN_EC_STATE",
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 1;
                              })
                            ].id,
                            {
                              maxEc: Number(
                                document.getElementById("relay2EcStart").value
                              ),
                              minEc: Number(
                                document.getElementById("relay2EcStop").value
                              ),
                            },
                            e.preventDefault()
                          )
                        }
                      >
                        SET
                      </button>
                    </div>
                  </form>
                )}

                {/* ******************* Timer ******************* */}
                {board.gpios[
                  board.gpios.findIndex((i) => {
                    return i.index === 1;
                  })
                ].gpio_datum.timerState && (
                  <>
                    <form className="mt-3 box-form">
                      <p>Timer</p>

                      <div className="mb-3">
                        <div className="form-group mb-3 timer-set">
                          <p>DAYS</p>
                          <FormControl
                            sx={{
                              mb: 2,
                              width: "100%",
                              maxWidth: "250px",
                              outlineColor: "#FFFF",
                            }}
                          >
                            <InputLabel
                              id="demo-multiple-name-label"
                              style={{ color: "white" }}
                            >
                              DAYS
                            </InputLabel>
                            <Select
                              labelId="demo-multiple-name-label"
                              id="demo-multiple-name"
                              multiple
                              style={{ color: "white" }}
                              value={relay2Days}
                              onChange={handleRelay2Change}
                              input={<OutlinedInput label="Name" />}
                              MenuProps={MenuProps}
                            >
                              {AllDays.map((name) => (
                                <MenuItem
                                  key={name}
                                  value={name}
                                  style={getStyles(name, relay2Days, theme)}
                                >
                                  {name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>

                        <div className="mb-3 mt-3 timer-set">
                          <p>START TIME</p>
                          <div>
                            <Box
                              component="form"
                              sx={{
                                "& .MuiTextField-root": {
                                  color: "white",
                                },
                              }}
                              noValidate
                              autoComplete="off"
                            >
                              <div>
                                <TextField
                                  fullWidth
                                  style={{ color: " #ffffff" }}
                                  id="relay2StartTime"
                                  label="START TIME"
                                  variant="outlined"
                                  defaultValue={nHour + ":" + nMin}
                                  type="time"
                                  disabled={Disable}
                                  inputProps={{
                                    style: {
                                      color: "white",
                                    },
                                  }}
                                />
                              </div>
                            </Box>
                          </div>

                          {/* <input
                                      id="valveStartTime"
                                      className="form-input"
                                      defaultValue={nHour + ":" + nMin}
                                      type="time"
                                      style={{ color: "white" }}
                                      disabled={Disable}
                                    ></input> */}
                        </div>

                        <div className="mb-3 timer-set">
                          <p>STOP TIME</p>
                          <div>
                            <Box
                              component="form"
                              sx={{
                                "& .MuiTextField-root": {
                                  color: "white",
                                },
                              }}
                              noValidate
                              autoComplete="off"
                            >
                              <div>
                                <TextField
                                  fullWidth
                                  style={{ color: " #ffffff" }}
                                  id="relay2StopTime"
                                  label="STOP TIME"
                                  variant="outlined"
                                  defaultValue={nHour + ":" + nMin}
                                  type="time"
                                  disabled={Disable}
                                  inputProps={{
                                    style: {
                                      color: "white",
                                    },
                                  }}
                                />
                              </div>
                            </Box>
                          </div>
                          {/* <input
                                      id="valveStopTime"
                                      className="form-input"
                                      defaultValue={nHour + ":" + nMin}
                                      type="time"
                                      style={{ color: "white" }}
                                      disabled={Disable}
                                    ></input> */}
                        </div>
                      </div>
                      <div>
                        <button
                          id="set"
                          onClick={(e) =>
                            createTimer(
                              "GPIO2",
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 1;
                                })
                              ].id,
                              {
                                start: String(
                                  document.getElementById("relay2StartTime")
                                    .value
                                ),
                                stop: String(
                                  document.getElementById("relay2StopTime")
                                    .value
                                ),
                              },
                              e.preventDefault()
                            )
                          }
                          disabled={Disable}
                        >
                          SET
                        </button>
                        {board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 1;
                          })
                        ].timers.length > 0 && (
                          <button
                            id="set"
                            className="mt-2"
                            onClick={(e) => {
                              handleOpenTimer(2, e.preventDefault());
                            }}
                          >
                            SHOW TIMER :
                            {
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 1;
                                })
                              ].timers.length
                            }
                          </button>
                        )}
                      </div>
                    </form>

                    <Dialog
                      open={relay2TimerOpen}
                      // onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        <h2>
                          TIMER{" "}
                          {
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 1;
                              })
                            ].title
                          }
                        </h2>
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          <table className="table table-hover table-dark">
                            <thead>
                              <tr style={{ textAlign: "center" }}>
                                <th>TIMER</th>
                                <th>START TIME</th>
                                <th>STOP TIME</th>
                                <th>DAYS</th>
                                <th>DELETE</th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                              {board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 1;
                                })
                              ].timers.map((timer, k) => {
                                return (
                                  <tr key={timer.id}>
                                    <td>{k + 1}</td>
                                    <td>{timer.start}</td>
                                    <td>{timer.stop}</td>
                                    <td>
                                      {timer.days.map((j, k) => {
                                        return (
                                          <>
                                            {timer.days.length > 1 ? (
                                              k === timer.days.length - 1 ? (
                                                <span>{j.day}</span>
                                              ) : (
                                                <span>{j.day},</span>
                                              )
                                            ) : (
                                              <span>{j.day}</span>
                                            )}
                                          </>
                                        );
                                      })}
                                    </td>
                                    <td>
                                      {" "}
                                      <div className="timer-button">
                                        <button
                                          className="btn btn-outline-danger"
                                          onClick={(e) =>
                                            deleteTimer(
                                              timer.id,
                                              timer.gpioId,
                                              e.preventDefault()
                                            )
                                          }
                                          disabled={Disable}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          {/* {board.relay1Timers.map((i,k)=>{
                            return(

                            )
                          })} */}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => handleOpenTimer(2)}>
                          CLOSE
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )}
              </div>
              {/* /******************************************/}
              {/* /***************RELAY3*********************/}
              <div className="box">
                <div className="box-title">
                  {relay3Name ? (
                    <div className="mb-3 set-name">
                      <input
                        className="form-control"
                        type="text"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 2;
                            })
                          ].title
                        }
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      ></input>
                      <button
                        className="btn btn-outline-success mt-2"
                        onClick={() =>
                          updateGpioName({
                            index:
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 2;
                                })
                              ].index,
                            name: name,
                          })
                        }
                      >
                        SET
                      </button>
                      <button
                        className="btn btn-outline-danger mt-2"
                        onClick={() => {
                          setRelay3Name(!relay3Name);
                        }}
                      >
                        CANCEL
                      </button>
                    </div>
                  ) : (
                    <p
                      className="button-title"
                      onClick={() => {
                        setRelay3Name(!relay3Name);
                      }}
                    >
                      {
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 2;
                          })
                        ].title
                      }
                    </p>
                  )}

                  {board.gpios[
                    board.gpios.findIndex((i) => {
                      return i.index === 2;
                    })
                  ].gpio_datum.phState ? (
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 2;
                      })
                    ].gpio_datum.maxPh >
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 2;
                      })
                    ].gpio_datum.minPh ? (
                      board.datum.ph >=
                      board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 2;
                        })
                      ].gpio_datum.maxPh ? (
                        <div className="alert">
                          <span>PH ALERT</span>
                        </div>
                      ) : (
                        <></>
                      )
                    ) : board.datum.ph <=
                      board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 2;
                        })
                      ].gpio_datum.maxPh ? (
                      <div className="alert">
                        <span>PH ALERT</span>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {board.gpios[
                    board.gpios.findIndex((i) => {
                      return i.index === 2;
                    })
                  ].gpio_datum.ecState ? (
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 2;
                      })
                    ].gpio_datum.maxEc >
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 2;
                      })
                    ].gpio_datum.minEc ? (
                      board.datum.ec >=
                      board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 2;
                        })
                      ].gpio_datum.maxEc ? (
                        <div className="alert">
                          <span>EC ALERT</span>
                        </div>
                      ) : (
                        <></>
                      )
                    ) : board.datum.ec <=
                      board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 2;
                        })
                      ].gpio_datum.maxEc ? (
                      <div className="alert">
                        <span>EC ALERT</span>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {(Boolean(
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 2;
                      })
                    ]
                  )
                    ? board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 2;
                        })
                      ].state
                    : false) === false ? (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => updateGpioState(2, 1)}
                      disabled={
                        Disable ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 2;
                          })
                        ].gpio_datum.phState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 2;
                          })
                        ].gpio_datum.ecState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 2;
                          })
                        ].gpio_datum.timerState
                      }
                    >
                      OFF
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-success blynk"
                      onClick={() => updateGpioState(2, 0)}
                      disabled={
                        Disable ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 2;
                          })
                        ].gpio_datum.phState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 2;
                          })
                        ].gpio_datum.ecState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 2;
                          })
                        ].gpio_datum.timerState
                      }
                    >
                      ON
                    </button>
                  )}
                  {/* ******************* SWITCH ******************* */}

                  <div className="Switch mt-3">
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 2;
                              })
                            ].gpio_datum.phState
                          }
                          onChange={(e) =>
                            updateGpioData(
                              "PH_STATE",
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 2;
                                })
                              ].id,
                              !board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 2;
                                })
                              ].gpio_datum.phState,
                              e.preventDefault()
                            )
                          }
                        />
                      }
                      disabled={
                        Disable ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 2;
                          })
                        ].gpio_datum.timerState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 2;
                          })
                        ].gpio_datum.ecState
                      }
                      label="PH"
                    />

                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 2;
                              })
                            ].gpio_datum.ecState
                          }
                          onChange={(e) =>
                            updateGpioData(
                              "EC_STATE",
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 2;
                                })
                              ].id,
                              !board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 2;
                                })
                              ].gpio_datum.ecState,
                              e.preventDefault()
                            )
                          }
                        />
                      }
                      disabled={
                        Disable ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 2;
                          })
                        ].gpio_datum.phState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 2;
                          })
                        ].gpio_datum.timerState
                      }
                      label="EC"
                    />

                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 2;
                              })
                            ].gpio_datum.timerState
                          }
                          onChange={(e) =>
                            updateGpioData(
                              "TIMER_STATE",
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 2;
                                })
                              ].id,
                              !board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 2;
                                })
                              ].gpio_datum.timerState,
                              e.preventDefault()
                            )
                          }
                        />
                      }
                      disabled={
                        Disable ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 2;
                          })
                        ].gpio_datum.phState ||
                        board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 2;
                          })
                        ].gpio_datum.ecState
                      }
                      label="TIMER"
                    />
                  </div>
                </div>
                {/* ******************* Ph ******************* */}
                {board.gpios[
                  board.gpios.findIndex((i) => {
                    return i.index === 2;
                  })
                ].gpio_datum.phState && (
                  <form className="mt-3 box-form">
                    <p>PH</p>
                    <div className="mb-3">
                      <label>START:</label>
                      <input
                        id="relay3PhStart"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 2;
                            })
                          ].gpio_datum.maxPh
                        }
                        className="form-input"
                        type="number"
                        min="0"
                        max="14"
                        style={{ color: "white" }}
                        disabled={Disable}
                      ></input>
                    </div>
                    <div className="mb-3">
                      <label>STOP:</label>
                      <input
                        id="relay3PhStop"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 2;
                            })
                          ].gpio_datum.minPh
                        }
                        className="form-input"
                        type="number"
                        min="0"
                        max="14"
                        style={{ color: "white" }}
                        disabled={Disable}
                      ></input>
                    </div>
                    <div>
                      <button
                        id="set"
                        disabled={Disable}
                        onClick={(e) =>
                          updateGpioData(
                            "MAX_MIN_PH_STATE",
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 2;
                              })
                            ].id,
                            {
                              maxPh: Number(
                                document.getElementById("relay3PhStart").value
                              ),
                              minPh: Number(
                                document.getElementById("relay3PhStop").value
                              ),
                            },
                            e.preventDefault()
                          )
                        }
                      >
                        SET
                      </button>
                    </div>
                  </form>
                )}

                {/* ******************* EC ******************* */}

                {board.gpios[
                  board.gpios.findIndex((i) => {
                    return i.index === 2;
                  })
                ].gpio_datum.ecState && (
                  <form className="mt-3 box-form">
                    <p>EC</p>
                    <div className="mb-3">
                      <label>START:</label>
                      <input
                        id="relay3EcStart"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 2;
                            })
                          ].gpio_datum.maxEc
                        }
                        className="form-input"
                        type="number"
                        min="0"
                        max="10000"
                        style={{ color: "white" }}
                        disabled={Disable}
                      ></input>
                    </div>
                    <div className="mb-3">
                      <label>STOP:</label>
                      <input
                        id="relay3EcStop"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 2;
                            })
                          ].gpio_datum.minEc
                        }
                        className="form-input"
                        type="number"
                        min="0"
                        max="10000"
                        style={{ color: "white" }}
                        disabled={Disable}
                      ></input>
                    </div>
                    <div>
                      <button
                        id="set"
                        disabled={Disable}
                        onClick={(e) =>
                          updateGpioData(
                            "MAX_MIN_EC_STATE",
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 2;
                              })
                            ].id,
                            {
                              maxEc: Number(
                                document.getElementById("relay3EcStart").value
                              ),
                              minEc: Number(
                                document.getElementById("relay3EcStop").value
                              ),
                            },
                            e.preventDefault()
                          )
                        }
                      >
                        SET
                      </button>
                    </div>
                  </form>
                )}

                {/* ******************* Timer ******************* */}
                {board.gpios[
                  board.gpios.findIndex((i) => {
                    return i.index === 2;
                  })
                ].gpio_datum.timerState && (
                  <>
                    <form className="mt-3 box-form">
                      <p>Timer</p>

                      <div className="mb-3">
                        <div className="form-group mb-3 timer-set">
                          <p>DAYS</p>
                          <FormControl
                            sx={{
                              mb: 2,
                              width: "100%",
                              maxWidth: "250px",
                              outlineColor: "#FFFF",
                            }}
                          >
                            <InputLabel
                              id="demo-multiple-name-label"
                              style={{ color: "white" }}
                            >
                              DAYS
                            </InputLabel>
                            <Select
                              labelId="demo-multiple-name-label"
                              id="demo-multiple-name"
                              multiple
                              style={{ color: "white" }}
                              value={relay3Days}
                              onChange={handleRelay3Change}
                              input={<OutlinedInput label="Name" />}
                              MenuProps={MenuProps}
                            >
                              {AllDays.map((name) => (
                                <MenuItem
                                  key={name}
                                  value={name}
                                  style={getStyles(name, relay3Days, theme)}
                                >
                                  {name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>

                        <div className="mb-3 mt-3 timer-set">
                          <p>START TIME</p>
                          <div>
                            <Box
                              component="form"
                              sx={{
                                "& .MuiTextField-root": {
                                  color: "white",
                                },
                              }}
                              noValidate
                              autoComplete="off"
                            >
                              <div>
                                <TextField
                                  fullWidth
                                  style={{ color: " #ffffff" }}
                                  id="relay3StartTime"
                                  label="START TIME"
                                  variant="outlined"
                                  defaultValue={nHour + ":" + nMin}
                                  type="time"
                                  disabled={Disable}
                                  inputProps={{
                                    style: {
                                      color: "white",
                                    },
                                  }}
                                />
                              </div>
                            </Box>
                          </div>

                          {/* <input
                                      id="valveStartTime"
                                      className="form-input"
                                      defaultValue={nHour + ":" + nMin}
                                      type="time"
                                      style={{ color: "white" }}
                                      disabled={Disable}
                                    ></input> */}
                        </div>

                        <div className="mb-3 timer-set">
                          <p>STOP TIME</p>
                          <div>
                            <Box
                              component="form"
                              sx={{
                                "& .MuiTextField-root": {
                                  color: "white",
                                },
                              }}
                              noValidate
                              autoComplete="off"
                            >
                              <div>
                                <TextField
                                  fullWidth
                                  style={{ color: " #ffffff" }}
                                  id="relay3StopTime"
                                  label="STOP TIME"
                                  variant="outlined"
                                  defaultValue={nHour + ":" + nMin}
                                  type="time"
                                  disabled={Disable}
                                  inputProps={{
                                    style: {
                                      color: "white",
                                    },
                                  }}
                                />
                              </div>
                            </Box>
                          </div>
                          {/* <input
                                      id="valveStopTime"
                                      className="form-input"
                                      defaultValue={nHour + ":" + nMin}
                                      type="time"
                                      style={{ color: "white" }}
                                      disabled={Disable}
                                    ></input> */}
                        </div>
                      </div>
                      <div>
                        <button
                          id="set"
                          onClick={(e) =>
                            createTimer(
                              "GPIO3",
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 2;
                                })
                              ].id,
                              {
                                start: String(
                                  document.getElementById("relay3StartTime")
                                    .value
                                ),
                                stop: String(
                                  document.getElementById("relay3StopTime")
                                    .value
                                ),
                              },
                              e.preventDefault()
                            )
                          }
                          disabled={Disable}
                        >
                          SET
                        </button>
                        {board.gpios[
                          board.gpios.findIndex((i) => {
                            return i.index === 2;
                          })
                        ].timers.length > 0 && (
                          <button
                            id="set"
                            className="mt-2"
                            onClick={(e) => {
                              handleOpenTimer(3, e.preventDefault());
                            }}
                          >
                            SHOW TIMER :
                            {
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 2;
                                })
                              ].timers.length
                            }
                          </button>
                        )}
                      </div>
                    </form>

                    <Dialog
                      open={relay3TimerOpen}
                      // onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        <h2>
                          TIMER{" "}
                          {
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 2;
                              })
                            ].title
                          }
                        </h2>
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          <table className="table table-hover table-dark">
                            <thead>
                              <tr style={{ textAlign: "center" }}>
                                <th>TIMER</th>
                                <th>START TIME</th>
                                <th>STOP TIME</th>
                                <th>DAYS</th>
                                <th>DELETE</th>
                              </tr>
                            </thead>
                            <tbody style={{ textAlign: "center" }}>
                              {board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 2;
                                })
                              ].timers.map((timer, k) => {
                                return (
                                  <tr key={timer.id}>
                                    <td>{k + 1}</td>
                                    <td>{timer.start}</td>
                                    <td>{timer.stop}</td>
                                    <td>
                                      {timer.days.map((j, k) => {
                                        return (
                                          <>
                                            {timer.days.length > 1 ? (
                                              k === timer.days.length - 1 ? (
                                                <span>{j.day}</span>
                                              ) : (
                                                <span>{j.day},</span>
                                              )
                                            ) : (
                                              <span>{j.day}</span>
                                            )}
                                          </>
                                        );
                                      })}
                                    </td>
                                    <td>
                                      {" "}
                                      <div className="timer-button">
                                        <button
                                          className="btn btn-outline-danger"
                                          onClick={(e) =>
                                            deleteTimer(
                                              timer.id,
                                              timer.gpioId,
                                              e.preventDefault()
                                            )
                                          }
                                          disabled={Disable}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          {/* {board.relay1Timers.map((i,k)=>{
                            return(

                            )
                          })} */}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => handleOpenTimer(3)}>
                          CLOSE
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )}
              </div>
              {/* /******************************************/}
              {/* /***************RELAY ALERT (4)*********************/}
              <div className="box">
                <div className="box-title">
                  <p
                    className="button-title"
                    onClick={() => {
                      Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "ALERT CAN'T CHANGE NAME!",
                      });
                    }}
                  >
                    ALERT
                  </p>

                  {board.gpios[
                    board.gpios.findIndex((i) => {
                      return i.index === 3;
                    })
                  ].gpio_datum.phState ? (
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 3;
                      })
                    ].gpio_datum.maxPh >
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 3;
                      })
                    ].gpio_datum.minPh ? (
                      board.datum.ph >=
                      board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 3;
                        })
                      ].gpio_datum.maxPh ? (
                        <div className="alert">
                          <span>PH ALERT</span>
                        </div>
                      ) : (
                        <></>
                      )
                    ) : board.datum.ph <=
                      board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 3;
                        })
                      ].gpio_datum.maxPh ? (
                      <div className="alert">
                        <span>PH ALERT</span>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {board.gpios[
                    board.gpios.findIndex((i) => {
                      return i.index === 3;
                    })
                  ].gpio_datum.ecState ? (
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 3;
                      })
                    ].gpio_datum.maxEc >
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 3;
                      })
                    ].gpio_datum.minEc ? (
                      board.datum.ec >=
                      board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 3;
                        })
                      ].gpio_datum.maxEc ? (
                        <div className="alert">
                          <span>EC ALERT</span>
                        </div>
                      ) : (
                        <></>
                      )
                    ) : board.datum.ec <=
                      board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 3;
                        })
                      ].gpio_datum.maxEc ? (
                      <div className="alert">
                        <span>EC ALERT</span>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {(Boolean(
                    board.gpios[
                      board.gpios.findIndex((i) => {
                        return i.index === 3;
                      })
                    ]
                  )
                    ? board.gpios[
                        board.gpios.findIndex((i) => {
                          return i.index === 3;
                        })
                      ].state
                    : false) === false ? (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => updateGpioState(3, 1)}
                      disabled={Disable}
                    >
                      OFF
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-success blynk"
                      onClick={() => updateGpioState(3, 0)}
                      disabled={Disable}
                    >
                      ON
                    </button>
                  )}
                  {/* ******************* SWITCH ******************* */}

                  <div className="Switch mt-3">
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 3;
                              })
                            ].gpio_datum.phState
                          }
                          onChange={(e) =>
                            updateGpioData(
                              "PH_STATE",
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 3;
                                })
                              ].id,
                              !board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 3;
                                })
                              ].gpio_datum.phState,
                              e.preventDefault()
                            )
                          }
                        />
                      }
                      disabled={Disable}
                      label="PH"
                    />

                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 3;
                              })
                            ].gpio_datum.ecState
                          }
                          onChange={(e) =>
                            updateGpioData(
                              "EC_STATE",
                              board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 3;
                                })
                              ].id,
                              !board.gpios[
                                board.gpios.findIndex((i) => {
                                  return i.index === 3;
                                })
                              ].gpio_datum.ecState,
                              e.preventDefault()
                            )
                          }
                        />
                      }
                      disabled={Disable}
                      label="EC"
                    />

                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={board.relayAlertWaterStatus}
                          onChange={(e) =>
                            relayControlTimer(
                              e.preventDefault(),
                              board.device_id,
                              board.relayAlertWaterStatus,
                              4,
                              "TIMER_STATUS"
                            )
                          }
                        />
                      }
                      disabled={true}
                      label="PUMP"
                    />
                  </div>
                </div>
                {/* ******************* Ph ******************* */}
                {board.gpios[
                  board.gpios.findIndex((i) => {
                    return i.index === 3;
                  })
                ].gpio_datum.phState && (
                  <form className="mt-3 box-form">
                    <p>PH</p>
                    <div className="mb-3">
                      <label>START:</label>
                      <input
                        id="relayAlertPhStart"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 3;
                            })
                          ].gpio_datum.maxPh
                        }
                        className="form-input"
                        type="number"
                        min="0"
                        max="14"
                        style={{ color: "white" }}
                        disabled={Disable}
                      ></input>
                    </div>
                    <div className="mb-3">
                      <label>STOP:</label>
                      <input
                        id="relayAlertPhStop"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 3;
                            })
                          ].gpio_datum.minPh
                        }
                        className="form-input"
                        type="number"
                        min="0"
                        max="14"
                        style={{ color: "white" }}
                        disabled={Disable}
                      ></input>
                    </div>
                    <div>
                      <button
                        id="set"
                        disabled={Disable}
                        onClick={(e) =>
                          updateGpioData(
                            "MAX_MIN_PH_STATE",
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 3;
                              })
                            ].id,
                            {
                              maxPh: Number(
                                document.getElementById("relayAlertPhStart")
                                  .value
                              ),
                              minPh: Number(
                                document.getElementById("relayAlertPhStop")
                                  .value
                              ),
                            },
                            e.preventDefault()
                          )
                        }
                      >
                        SET
                      </button>
                    </div>
                  </form>
                )}

                {/* ******************* EC ******************* */}

                {board.gpios[
                  board.gpios.findIndex((i) => {
                    return i.index === 3;
                  })
                ].gpio_datum.ecState && (
                  <form className="mt-3 box-form">
                    <p>EC</p>
                    <div className="mb-3">
                      <label>START:</label>
                      <input
                        id="relayAlertEcStart"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 3;
                            })
                          ].gpio_datum.maxEc
                        }
                        className="form-input"
                        type="number"
                        min="0"
                        max="10000"
                        style={{ color: "white" }}
                        disabled={Disable}
                      ></input>
                    </div>
                    <div className="mb-3">
                      <label>STOP:</label>
                      <input
                        id="relayAlertEcStop"
                        defaultValue={
                          board.gpios[
                            board.gpios.findIndex((i) => {
                              return i.index === 3;
                            })
                          ].gpio_datum.minEc
                        }
                        className="form-input"
                        type="number"
                        min="0"
                        max="10000"
                        style={{ color: "white" }}
                        disabled={Disable}
                      ></input>
                    </div>
                    <div>
                      <button
                        id="set"
                        disabled={Disable}
                        onClick={(e) =>
                          updateGpioData(
                            "MAX_MIN_EC_STATE",
                            board.gpios[
                              board.gpios.findIndex((i) => {
                                return i.index === 3;
                              })
                            ].id,
                            {
                              maxEc: Number(
                                document.getElementById("relayAlertEcStart")
                                  .value
                              ),
                              minEc: Number(
                                document.getElementById("relayAlertEcStop")
                                  .value
                              ),
                            },
                            e.preventDefault()
                          )
                        }
                      >
                        SET
                      </button>
                    </div>
                  </form>
                )}

                {/* ******************* WATER PUMP ******************* */}

                {board.relayAlertWaterStatus && (
                  <form className="mt-3 box-form">
                    <p>RELAY NO</p>
                    <div className="mb-3">
                      <label>RELAY:</label>
                      <input
                        id="relayAlertRelay"
                        defaultValue={board.relayAlertWaterRelay}
                        className="form-input"
                        type="number"
                        min="1"
                        max="3"
                        style={{ color: "white" }}
                        disabled={Disable}
                      ></input>
                    </div>

                    <div>
                      <button
                        id="set"
                        disabled={Disable}
                        onClick={(e) =>
                          relayControlTimer(
                            e.preventDefault(),
                            board.device_id,
                            4,
                            4,
                            "PUMP_RELAY_ALERT"
                          )
                        }
                      >
                        SET
                      </button>
                    </div>
                  </form>
                )}
              </div>
              {/* /******************************************/}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h1>PLEASE CONFIG BOARD</h1>
        <h2>BOARD ID:{board.device_id}</h2>
      </div>
    );
  }
};

export default Mqtt;
