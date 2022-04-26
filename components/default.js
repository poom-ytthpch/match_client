import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const Swal = require("sweetalert2");
import axios from "axios";
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

const server = "https://boardapi.herokuapp.com";
// const server = "https://www.matchchemical.tk:57524";
// const server = "http://localhost:4003";

const Default = ({ board }) => {
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

    const handleOpenTimer = async (relay) => {
      switch (relay) {
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

    // console.log(start, stop);
    const handleSetName = async (b_id, relay, D_name) => {
      if (name !== "") {
        if (name.length <= 10) {
          const alert = Swal.fire({
            title: "PLEASE WAIT!",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          await axios.post(`${server}/dataUpdate`, {
            b_id: b_id,
            dataUpdate: true,
          });
          await axios
            .post(`${server}/relayControl`, {
              b_id: b_id,
              type: "SET_NAME",
              name: name,
              relay: relay,
            })
            .then(() => {
              alert.close();
              setName("");
              setRelay1Name(false);
              setRelay2Name(false);
              setRelay3Name(false);
            });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "TOO LONGER NAME",
          });
        }
      } else {
        const alert = Swal.fire({
          title: "PLEASE WAIT!",
          timerProgressBar: true,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        await axios.post(`${server}/dataUpdate`, {
          b_id: b_id,
          dataUpdate: true,
        });
        await axios
          .post(`${server}/relayControl`, {
            b_id: b_id,
            type: "SET_NAME",
            name: D_name,
            relay: relay,
          })
          .then(() => {
            setName("");
            setRelay1Name(false);
            setRelay2Name(false);
            setRelay3Name(false);
            alert.close();
          });
      }
    };

    const relayControl = async (b_id, relay, status) => {
      const alert = Swal.fire({
        title: "PLEASE WAIT!",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        await axios.post(`${server}/dataUpdate`, {
          b_id: b_id,
          dataUpdate: true,
        });
        await axios
          .post(`${server}/relayControl`, {
            b_id: b_id,
            relay: relay,
            status: status,
            type: "RELAY_STATUS",
          })
          .then(() => {
            alert.close();
          });
      } catch (err) {
        console.log(err);
        alert.close();
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

    const relayControlTimer = async (e, b_id, status, relay, type, length) => {
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
            b_id: b_id,
            dataUpdate: true,
          });
          await axios
            .post(`${server}/relayControlTimer`, {
              b_id: b_id,
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
              b_id: b_id,
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
                        b_id: b_id,
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
                        b_id: b_id,
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
                        b_id: b_id,
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
                b_id: b_id,
                dataUpdate: true,
              });

              await axios
                .post(`${server}/relayControlTimer`, {
                  b_id: b_id,
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

    const relayControlTimerDelete = async (e, b_id, relay, id, type) => {
      switch (Number(relay)) {
        case 1:
          handleOpenTimer(1);
          break;
        case 2:
          handleOpenTimer(2);
          break;
        case 3:
          handleOpenTimer(3);
          break;
      }

      switch (type) {
        case "TIMER_DELETE":
          const alert = Swal.fire({
            title: "PLEASE WAIT!",
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          await axios.post(`${server}/dataUpdate`, {
            b_id: b_id,
            dataUpdate: true,
          });

          await axios
            .post(`${server}/relayControlTimer`, {
              b_id: b_id,
              id: id,
              type: type,
              relay: relay,
            })
            .then(() => {
              alert.close();
            });

          break;
      }
    };

    const relayControlPh = async (e, b_id, relay, type, status) => {
      try {
        switch (type) {
          case "PH_STATUS":
            const alert = Swal.fire({
              title: "PLEASE WAIT!",
              timerProgressBar: true,
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });

            await axios.post(`${server}/dataUpdate`, {
              b_id: b_id,
              dataUpdate: true,
            });

            await axios
              .post(`${server}/relayControlPh`, {
                b_id: b_id,
                relay: relay,
                status: !status,
                type: type,
              })
              .then(() => {
                alert.close();
              });
            break;
          case "PH_SET_CONTROL":
            switch (Number(relay)) {
              case 1:
                const relay1PhStart =
                  document.getElementById("relay1PhStart").value;
                const relay1PhStop =
                  document.getElementById("relay1PhStop").value;
                if (relay1PhStart !== relay1PhStop) {
                  if (
                    relay1PhStart <= 14 &&
                    relay1PhStop >= 0 &&
                    relay1PhStart >= 0 &&
                    relay1PhStop <= 14
                  ) {
                    const alert = Swal.fire({
                      title: "PLEASE WAIT!",
                      timerProgressBar: true,
                      allowOutsideClick: false,
                      didOpen: () => {
                        Swal.showLoading();
                      },
                    });

                    await axios.post(`${server}/dataUpdate`, {
                      b_id: b_id,
                      dataUpdate: true,
                    });

                    await axios
                      .post(`${server}/relayControlPh`, {
                        b_id: b_id,
                        relay: relay,
                        status: status,
                        type: type,
                        phStart: relay1PhStart,
                        phStop: relay1PhStop,
                      })
                      .then(() => {
                        alert.close();
                      });
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Please Input Start Or Stop Less Than Or Equal 14 and Start Or Stop More Than 0",
                    });
                  }
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "CAN'T INPUT EQUAL VALUE",
                  });
                }

                break;
              case 2:
                const relay2PhStart =
                  document.getElementById("relay2PhStart").value;
                const relay2PhStop =
                  document.getElementById("relay2PhStop").value;

                if (relay2PhStart !== relay2PhStop) {
                  if (
                    relay2PhStart <= 14 &&
                    relay2PhStop >= 0 &&
                    relay2PhStart >= 0 &&
                    relay2PhStop <= 14
                  ) {
                    const alert = Swal.fire({
                      title: "PLEASE WAIT!",
                      timerProgressBar: true,
                      allowOutsideClick: false,
                      didOpen: () => {
                        Swal.showLoading();
                      },
                    });

                    await axios.post(`${server}/dataUpdate`, {
                      b_id: b_id,
                      dataUpdate: true,
                    });

                    await axios
                      .post(`${server}/relayControlPh`, {
                        b_id: b_id,
                        relay: relay,
                        status: status,
                        type: type,
                        phStart: relay2PhStart,
                        phStop: relay2PhStop,
                      })
                      .then(() => {
                        alert.close();
                      });
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Please Input Start Or Stop Less Than Or Equal 14 and Start Or Stop More Than 0",
                    });
                  }
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "CAN'T INPUT EQUAL VALUE",
                  });
                }

                break;

              case 3:
                const relay3PhStart =
                  document.getElementById("relay3PhStart").value;
                const relay3PhStop =
                  document.getElementById("relay3PhStop").value;

                if (relay3PhStart !== relay3PhStop) {
                  if (
                    relay3PhStart <= 14 &&
                    relay3PhStop >= 0 &&
                    relay3PhStart >= 0 &&
                    relay3PhStop <= 14
                  ) {
                    const alert = Swal.fire({
                      title: "PLEASE WAIT!",
                      timerProgressBar: true,
                      allowOutsideClick: false,
                      didOpen: () => {
                        Swal.showLoading();
                      },
                    });

                    await axios.post(`${server}/dataUpdate`, {
                      b_id: b_id,
                      dataUpdate: true,
                    });

                    await axios
                      .post(`${server}/relayControlPh`, {
                        b_id: b_id,
                        relay: relay,
                        status: status,
                        type: type,
                        phStart: relay3PhStart,
                        phStop: relay3PhStop,
                      })
                      .then(() => {
                        alert.close();
                      });
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Please Input Start Or Stop Less Than Or Equal 14 and Start Or Stop More Than 0",
                    });
                  }
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "CAN'T INPUT EQUAL VALUE",
                  });
                }

                break;

              case 4:
                const relayAlertPhStart =
                  document.getElementById("relayAlertPhStart").value;
                const relayAlertPhStop =
                  document.getElementById("relayAlertPhStop").value;
                if (relayAlertPhStart !== relayAlertPhStop) {
                  if (
                    relayAlertPhStart <= 14 &&
                    relayAlertPhStop >= 0 &&
                    relayAlertPhStart >= 0 &&
                    relayAlertPhStop <= 14
                  ) {
                    const alert = Swal.fire({
                      title: "PLEASE WAIT!",
                      timerProgressBar: true,
                      allowOutsideClick: false,
                      didOpen: () => {
                        Swal.showLoading();
                      },
                    });

                    await axios.post(`${server}/dataUpdate`, {
                      b_id: b_id,
                      dataUpdate: true,
                    });

                    await axios
                      .post(`${server}/relayControlPh`, {
                        b_id: b_id,
                        relay: relay,
                        status: status,
                        type: type,
                        phStart: relayAlertPhStart,
                        phStop: relayAlertPhStop,
                      })
                      .then(() => {
                        alert.close();
                      });
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Please Input Start Or Stop Less Than Or Equal 14 and Start Or Stop More Than 0",
                    });
                  }
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "CAN'T INPUT EQUAL VALUE",
                  });
                }

                break;
            }
            break;
        }
      } catch (err) {
        // console.log(err);
      }
    };

    const relayControlEc = async (e, b_id, relay, type, status) => {
      try {
        switch (type) {
          case "EC_STATUS":
            const alert = Swal.fire({
              title: "PLEASE WAIT!",
              timerProgressBar: true,
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });

            await axios.post(`${server}/dataUpdate`, {
              b_id: b_id,
              dataUpdate: true,
            });

            await axios
              .post(`${server}/relayControlEc`, {
                b_id: b_id,
                relay: relay,
                status: !status,
                type: type,
              })
              .then(() => {
                alert.close();
              });
            break;
          case "EC_SET_CONTROL":
            switch (Number(relay)) {
              case 1:
                const relay1EcStart =
                  document.getElementById("relay1EcStart").value;
                const relay1EcStop =
                  document.getElementById("relay1EcStop").value;

                if (relay1EcStart !== relay1EcStop) {
                  if (
                    relay1EcStart <= 10000 &&
                    relay1EcStop >= 0 &&
                    relay1EcStart >= 0 &&
                    relay1EcStop <= 10000
                  ) {
                    const alert = Swal.fire({
                      title: "PLEASE WAIT!",
                      timerProgressBar: true,
                      allowOutsideClick: false,
                      didOpen: () => {
                        Swal.showLoading();
                      },
                    });

                    await axios.post(`${server}/dataUpdate`, {
                      b_id: b_id,
                      dataUpdate: true,
                    });

                    await axios
                      .post(`${server}/relayControlEc`, {
                        b_id: b_id,
                        relay: relay,
                        status: status,
                        type: type,
                        ecStart: relay1EcStart,
                        ecStop: relay1EcStop,
                      })
                      .then(() => {
                        alert.close();
                      });
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Please Input Start Or Stop Less Than Or Equal 10000 and Start Or Stop More Than 0",
                    });
                  }
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "CAN'T INPUT EQUAL VALUE",
                  });
                }

                break;
              case 2:
                const relay2EcStart =
                  document.getElementById("relay2EcStart").value;
                const relay2EcStop =
                  document.getElementById("relay2EcStop").value;
                if (relay2EcStart !== relay2EcStop) {
                  if (
                    relay2EcStart <= 10000 &&
                    relay2EcStop >= 0 &&
                    relay2EcStart >= 0 &&
                    relay2EcStop <= 10000
                  ) {
                    const alert = Swal.fire({
                      title: "PLEASE WAIT!",
                      timerProgressBar: true,
                      allowOutsideClick: false,
                      didOpen: () => {
                        Swal.showLoading();
                      },
                    });

                    await axios.post(`${server}/dataUpdate`, {
                      b_id: b_id,
                      dataUpdate: true,
                    });

                    await axios
                      .post(`${server}/relayControlEc`, {
                        b_id: b_id,
                        relay: relay,
                        status: status,
                        type: type,
                        ecStart: relay2EcStart,
                        ecStop: relay2EcStop,
                      })
                      .then(() => {
                        alert.close();
                      });
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Please Input Start Or Stop Less Than Or Equal 10000 and Start Or Stop More Than 0",
                    });
                  }
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "CAN'T INPUT EQUAL VALUE",
                  });
                }

                break;

              case 3:
                const relay3EcStart =
                  document.getElementById("relay3EcStart").value;
                const relay3EcStop =
                  document.getElementById("relay3EcStop").value;
                if (relay3EcStart !== relay3EcStop) {
                  if (
                    relay3EcStart <= 10000 &&
                    relay3EcStop >= 0 &&
                    relay3EcStart >= 0 &&
                    relay3EcStop <= 10000
                  ) {
                    const alert = Swal.fire({
                      title: "PLEASE WAIT!",
                      timerProgressBar: true,
                      allowOutsideClick: false,
                      didOpen: () => {
                        Swal.showLoading();
                      },
                    });

                    await axios.post(`${server}/dataUpdate`, {
                      b_id: b_id,
                      dataUpdate: true,
                    });

                    await axios
                      .post(`${server}/relayControlEc`, {
                        b_id: b_id,
                        relay: relay,
                        status: status,
                        type: type,
                        ecStart: relay3EcStart,
                        ecStop: relay3EcStop,
                      })
                      .then(() => {
                        alert.close();
                      });
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Please Input Start Or Stop Less Than Or Equal 10000 and Start Or Stop More Than 0",
                    });
                  }
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "CAN'T INPUT EQUAL VALUE",
                  });
                }

                break;
              case 4:
                const relayAlertEcStart =
                  document.getElementById("relayAlertEcStart").value;
                const relayAlertEcStop =
                  document.getElementById("relayAlertEcStop").value;
                if (relayAlertEcStart !== relayAlertEcStop) {
                  if (
                    relayAlertEcStart <= 10000 &&
                    relayAlertEcStop >= 0 &&
                    relayAlertEcStart >= 0 &&
                    relayAlertEcStop <= 10000
                  ) {
                    const alert = Swal.fire({
                      title: "PLEASE WAIT!",
                      timerProgressBar: true,
                      allowOutsideClick: false,
                      didOpen: () => {
                        Swal.showLoading();
                      },
                    });

                    await axios.post(`${server}/dataUpdate`, {
                      b_id: b_id,
                      dataUpdate: true,
                    });

                    await axios
                      .post(`${server}/relayControlEc`, {
                        b_id: b_id,
                        relay: relay,
                        status: status,
                        type: type,
                        ecStart: relayAlertEcStart,
                        ecStop: relayAlertEcStop,
                      })
                      .then(() => {
                        alert.close();
                      });
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Please Input Start Or Stop Less Than Or Equal 10000 and Start Or Stop More Than 0",
                    });
                  }
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "CAN'T INPUT EQUAL VALUE",
                  });
                }

                break;
            }
            break;
        }
      } catch (err) {
        console.log(err);
      }
    };

    const handleSensorInput = async (e, b_id, type, status) => {
      try {
        const alert = Swal.fire({
          title: "PLEASE WAIT!",
          timerProgressBar: true,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await axios.post(`${server}/dataUpdate`, {
          b_id: b_id,
          dataUpdate: true,
        });

        await axios
          .post(`${server}/sensorInput`, {
            b_id: b_id,
            type: type,
            status: !status,
          })
          .then(() => {
            alert.close();
          });
      } catch (err) {
        console.log(err);
      }
    };

    const updateBoardName = async (b_id, b_name) => {
      const alert = Swal.fire({
        title: "PLEASE WAIT!",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      if (b_name === "") {
        alert.close();

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "PLEASE INPUT NAME",
        });

        setBoardNameStatus(false);
      } else {
        await axios.post(`${server}/dataUpdate`, {
          b_id: b_id,
          dataUpdate: true,
        });
        await axios
          .post(`${server}/boardName`, {
            b_id: b_id,
            b_name: b_name,
          })
          .then(() => {
            alert.close();
            // window.location.reload(false);
          });
      }
    };

    const autoStatus = async (b_id, auto) => {
      const alert = Swal.fire({
        title: "PLEASE WAIT!",
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await axios.post(`${server}/dataUpdate`, {
        b_id: b_id,
        dataUpdate: true,
      });

      await axios
        .post(`${server}/auto`, {
          b_id: b_id,
          auto: !auto,
        })
        .then(() => {
          alert.close();
        });
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
    const dateTime = board.uDate;
    const now = Date(Date.now);
    const tmpDT = dateTime.split(" ");
    const tmpNow = now.split(" ");
    const relay1Timers = board.relay1Timers;
    const bclTimer = board.bclTimers;
    const b_id = board.b_id;
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
    const Disable =
      nYear !== year ||
      nMonth !== month ||
      nDay !== day ||
      nHour !== Hour ||
      nMin !== Min;

    return (
      <div>
        <div
          className={`board ${Disable ? "B_offline" : "B_online"}`}
          key={b_id}
        >
          <div className="mb-3 ">
            <div className="board-header">
              <p className="board-title">
                BOARD NAME:{" "}
                {boardNameStatus ? (
                  <div className="mb-3 container set-name">
                    <input
                      className="form-control"
                      type="text"
                      defaultValue={board.b_name}
                      onChange={(e) => {
                        setBoardName(e.target.value);
                      }}
                    ></input>
                    <div>
                      <button
                        className="btn btn-outline-success mt-2"
                        onClick={() => updateBoardName(board.b_id, boardName)}
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
                    {board.b_name.toUpperCase()}
                  </span>
                )}
              </p>
              <p className="board-status">
                BOARD STATUS:{" "}
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
                BOARD ID: <span className="time">{board.b_id}</span>
              </p>
              <div>
                <FormControlLabel
                  control={
                    <IOSSwitch
                      sx={{ m: 1 }}
                      checked={board.auto}
                      onChange={(e) => autoStatus(b_id, board.auto)}
                    />
                  }
                  disabled={Disable}
                  label="AUTO"
                />
              </div>
            </div>

            <div className="board-box">
              {/* /***************BOARD TEMP PROGRESS*********************/}

              <div>
                <span className="title">BOARD TEMP</span>
                <br></br>
                {board.boardFan ? (
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

                <br></br>
                <div className="progress-box">
                  <CircularProgressbar
                    value={board.boardTemp}
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
                    text={`${board.boardTemp} *C`}
                  />
                </div>
              </div>

              {/* /***************BOARD HUM PROGRESS*********************/}

              <div>
                <span className="title">BOARD HUM</span>
                <br></br>
                <br></br>
                <br></br>
                <div className="progress-box">
                  <CircularProgressbar
                    value={board.boardHum}
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
                    text={`${board.boardHum} %`}
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
                        checked={board.phInput}
                        onChange={(e) =>
                          handleSensorInput(
                            e.preventDefault(),
                            b_id,
                            "PH_SENSOR",
                            board.phInput
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
                    value={board.ph}
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
                    text={`${board.ph} PH`}
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
                    value={board.phTemp}
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
                    text={`${board.phTemp} *C`}
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
                        checked={board.ecInput}
                        onChange={(e) =>
                          handleSensorInput(
                            e.preventDefault(),
                            b_id,
                            "EC_SENSOR",
                            board.ecInput
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
                    value={board.ec}
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
                    text={`${board.ec} MS`}
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
                    value={board.ecTemp}
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
                    text={`${board.ecTemp} *C`}
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
                            b_id,
                            "WATER_FLOW_SENSOR",
                            board.waterFlowInput
                          )
                        }
                      />
                    }
                    disabled={Disable}
                    label={`WF SENSOR`}
                  />
                </div>

                <div className="progress-box">
                  <CircularProgressbar
                    value={flow}
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
                    text={`${flow} L/H `}
                  />
                </div>
                {flow > 0 ? (
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
                    value={board.total}
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
                    text={`${board.total} L\n`}
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
                        defaultValue={board.relay1Name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      ></input>
                      <button
                        className="btn btn-outline-success mt-2"
                        onClick={() =>
                          handleSetName(board.b_id, 1, board.relay1Name)
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
                      {board.relay1Name}
                    </p>
                  )}

                  {board.relay1PhStatus ? (
                    board.relay1PhStart > board.relay1PhStop ? (
                      board.ph >= board.relay1PhStart ? (
                        <div className="alert">
                          <span>PH ALERT</span>
                        </div>
                      ) : (
                        <></>
                      )
                    ) : board.ph <= board.relay1PhStart ? (
                      <div className="alert">
                        <span>PH ALERT</span>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {board.relay1EcStatus ? (
                    board.relay1EcStart > board.relay1EcStop ? (
                      board.ec >= board.relay1EcStart ? (
                        <div className="alert">
                          <span>EC ALERT</span>
                        </div>
                      ) : (
                        <></>
                      )
                    ) : board.ec <= board.relay1EcStart ? (
                      <div className="alert">
                        <span>EC ALERT</span>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {board.relay1Status === 0 ? (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => relayControl(b_id, 1, 1)}
                      disabled={
                        Disable ||
                        board.relay1EcStatus ||
                        board.relay1PhStatus ||
                        board.relay1TimerStatus
                      }
                    >
                      OFF
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      onClick={() => relayControl(b_id, 1, 0)}
                      disabled={
                        Disable ||
                        board.relay1EcStatus ||
                        board.relay1PhStatus ||
                        board.relay1TimerStatus
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
                          checked={board.relay1PhStatus}
                          onChange={(e) =>
                            relayControlPh(
                              e.preventDefault(),
                              board.b_id,
                              1,
                              "PH_STATUS",
                              board.relay1PhStatus
                            )
                          }
                        />
                      }
                      disabled={
                        Disable ||
                        board.relay1TimerStatus ||
                        board.relay1EcStatus
                      }
                      label="PH"
                    />

                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={board.relay1EcStatus}
                          onChange={(e) =>
                            relayControlEc(
                              e.preventDefault(),
                              board.b_id,
                              1,
                              "EC_STATUS",
                              board.relay1EcStatus
                            )
                          }
                        />
                      }
                      disabled={
                        Disable ||
                        board.relay1PhStatus ||
                        board.relay1TimerStatus
                      }
                      label="EC"
                    />

                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={board.relay1TimerStatus}
                          onChange={(e) =>
                            relayControlTimer(
                              e.preventDefault(),
                              board.b_id,
                              board.relay1TimerStatus,
                              1,
                              "TIMER_STATUS"
                            )
                          }
                        />
                      }
                      disabled={
                        Disable || board.relay1PhStatus || board.relay1EcStatus
                      }
                      label="TIMER"
                    />
                  </div>
                </div>
                {/* ******************* Ph ******************* */}
                {board.relay1PhStatus && (
                  <form className="mt-3 box-form">
                    <p>PH</p>
                    <div className="mb-3">
                      <label>START:</label>
                      <input
                        id="relay1PhStart"
                        defaultValue={board.relay1PhStart}
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
                        defaultValue={board.relay1PhStop}
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
                          relayControlPh(
                            e.preventDefault(),
                            board.b_id,
                            1,
                            "PH_SET_CONTROL",
                            board.relay1PhStatus
                          )
                        }
                      >
                        SET
                      </button>
                    </div>
                  </form>
                )}

                {/* ******************* EC ******************* */}

                {board.relay1EcStatus && (
                  <form className="mt-3 box-form">
                    <p>EC</p>
                    <div className="mb-3">
                      <label>START:</label>
                      <input
                        id="relay1EcStart"
                        defaultValue={board.relay1EcStart}
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
                        defaultValue={board.relay1EcStop}
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
                          relayControlEc(
                            e.preventDefault(),
                            board.b_id,
                            1,
                            "EC_SET_CONTROL",
                            board.relay1EcStatus
                          )
                        }
                      >
                        SET
                      </button>
                    </div>
                  </form>
                )}

                {/* ******************* Timer ******************* */}
                {board.relay1TimerStatus && (
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
                            relayControlTimer(
                              e.preventDefault(),
                              board.b_id,
                              board.relay1TimerStatus,
                              1,
                              "TIMER_SET",
                              board.relay1Timers.length
                            )
                          }
                          disabled={Disable}
                        >
                          SET
                        </button>
                        {board.relay1Timers.length > 0 && (
                          <button
                            id="set"
                            className="mt-2"
                            onClick={(e) => {
                              handleOpenTimer(1, e.preventDefault());
                            }}
                          >
                            SHOW TIMER :{board.relay1Timers.length}
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
                        <h2>TIMER RELAY 1</h2>
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
                              {board.relay1Timers.map((i, k) => {
                                return (
                                  <tr>
                                    <td>{k + 1}</td>
                                    <td>{i.startTime}</td>
                                    <td>{i.stopTime}</td>
                                    <td>
                                      {i.aDay.map((j, k) => {
                                        return (
                                          <>
                                            {i.aDay.length > 1 ? (
                                              k === i.aDay.length - 1 ? (
                                                <span>{j.days}</span>
                                              ) : (
                                                <span>{j.days},</span>
                                              )
                                            ) : (
                                              <span>{j.days}</span>
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
                                            relayControlTimerDelete(
                                              e.preventDefault(),
                                              b_id,
                                              1,
                                              i._id,
                                              "TIMER_DELETE"
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
                        defaultValue={board.relay2Name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      ></input>
                      <button
                        className="btn btn-outline-success mt-2"
                        onClick={() =>
                          handleSetName(board.b_id, 2, board.relay2Name)
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
                      {board.relay2Name}
                    </p>
                  )}

                  {board.relay2PhStatus ? (
                    board.relay2PhStart > board.relay2PhStop ? (
                      board.ph >= board.relay2PhStart ? (
                        <div className="alert">
                          <span>PH ALERT</span>
                        </div>
                      ) : (
                        <></>
                      )
                    ) : board.ph <= board.relay2PhStart ? (
                      <div className="alert">
                        <span>PH ALERT</span>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {board.relay2EcStatus ? (
                    board.relay2EcStart > board.relay2EcStop ? (
                      board.ec >= board.relay2EcStart ? (
                        <div className="alert">
                          <span>EC ALERT</span>
                        </div>
                      ) : (
                        <></>
                      )
                    ) : board.ec <= board.relay2EcStart ? (
                      <div className="alert">
                        <span>EC ALERT</span>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {board.relay2Status === 0 ? (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => relayControl(b_id, 2, 1)}
                      disabled={
                        Disable ||
                        board.relay2EcStatus ||
                        board.relay2PhStatus ||
                        board.relay2TimerStatus
                      }
                    >
                      OFF
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      onClick={() => relayControl(b_id, 2, 0)}
                      disabled={
                        Disable ||
                        board.relay2EcStatus ||
                        board.relay2PhStatus ||
                        board.relay2TimerStatus
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
                          checked={board.relay2PhStatus}
                          onChange={(e) =>
                            relayControlPh(
                              e.preventDefault(),
                              board.b_id,
                              2,
                              "PH_STATUS",
                              board.relay2PhStatus
                            )
                          }
                        />
                      }
                      disabled={
                        Disable ||
                        board.relay2TimerStatus ||
                        board.relay2EcStatus
                      }
                      label="PH"
                    />

                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={board.relay2EcStatus}
                          onChange={(e) =>
                            relayControlEc(
                              e.preventDefault(),
                              board.b_id,
                              2,
                              "EC_STATUS",
                              board.relay2EcStatus
                            )
                          }
                        />
                      }
                      disabled={
                        Disable ||
                        board.relay2PhStatus ||
                        board.relay2TimerStatus
                      }
                      label="EC"
                    />

                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={board.relay2TimerStatus}
                          onChange={(e) =>
                            relayControlTimer(
                              e.preventDefault(),
                              board.b_id,
                              board.relay2TimerStatus,
                              2,
                              "TIMER_STATUS"
                            )
                          }
                        />
                      }
                      disabled={
                        Disable || board.relay2PhStatus || board.relay2EcStatus
                      }
                      label="TIMER"
                    />
                  </div>
                </div>
                {/* ******************* Ph ******************* */}
                {board.relay2PhStatus && (
                  <form className="mt-3 box-form">
                    <p>PH</p>
                    <div className="mb-3">
                      <label>START:</label>
                      <input
                        id="relay2PhStart"
                        defaultValue={board.relay2PhStart}
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
                        defaultValue={board.relay2PhStop}
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
                          relayControlPh(
                            e.preventDefault(),
                            board.b_id,
                            2,
                            "PH_SET_CONTROL",
                            board.relay2PhStatus
                          )
                        }
                      >
                        SET
                      </button>
                    </div>
                  </form>
                )}

                {/* ******************* EC ******************* */}

                {board.relay2EcStatus && (
                  <form className="mt-3 box-form">
                    <p>EC</p>
                    <div className="mb-3">
                      <label>START:</label>
                      <input
                        id="relay2EcStart"
                        defaultValue={board.relay2EcStart}
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
                        defaultValue={board.relay2EcStop}
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
                          relayControlEc(
                            e.preventDefault(),
                            board.b_id,
                            2,
                            "EC_SET_CONTROL",
                            board.relay2EcStatus
                          )
                        }
                      >
                        SET
                      </button>
                    </div>
                  </form>
                )}

                {/* ******************* Timer ******************* */}
                {board.relay2TimerStatus && (
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
                            relayControlTimer(
                              e.preventDefault(),
                              board.b_id,
                              board.relay2TimerStatus,
                              2,
                              "TIMER_SET",
                              board.relay2Timers.length
                            )
                          }
                          disabled={Disable}
                        >
                          SET
                        </button>
                        {board.relay2Timers.length > 0 && (
                          <button
                            id="set"
                            className="mt-2"
                            onClick={(e) => {
                              handleOpenTimer(2, e.preventDefault());
                            }}
                          >
                            SHOW TIMER :{board.relay2Timers.length}
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
                        <h2>TIMER RELAY 2</h2>
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
                              {board.relay2Timers.map((i, k) => {
                                return (
                                  <tr>
                                    <td>{k + 1}</td>
                                    <td>{i.startTime}</td>
                                    <td>{i.stopTime}</td>
                                    <td>
                                      {i.aDay.map((j, k) => {
                                        return (
                                          <>
                                            {i.aDay.length > 1 ? (
                                              k === i.aDay.length - 1 ? (
                                                <span>{j.days}</span>
                                              ) : (
                                                <span>{j.days},</span>
                                              )
                                            ) : (
                                              <span>{j.days}</span>
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
                                            relayControlTimerDelete(
                                              e.preventDefault(),
                                              b_id,
                                              2,
                                              i._id,
                                              "TIMER_DELETE"
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
                        defaultValue={board.relay3Name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      ></input>
                      <button
                        className="btn btn-outline-success mt-2"
                        onClick={() =>
                          handleSetName(board.b_id, 3, board.relay3Name)
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
                      {board.relay3Name}
                    </p>
                  )}

                  {board.relay3PhStatus ? (
                    board.relay3PhStart > board.relay3PhStop ? (
                      board.ph >= board.relay3PhStart ? (
                        <div className="alert">
                          <span>PH ALERT</span>
                        </div>
                      ) : (
                        <></>
                      )
                    ) : board.ph <= board.relay3PhStart ? (
                      <div className="alert">
                        <span>PH ALERT</span>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {board.relay3EcStatus ? (
                    board.relay3EcStart > board.relay3EcStop ? (
                      board.ec >= board.relay3EcStart ? (
                        <div className="alert">
                          <span>EC ALERT</span>
                        </div>
                      ) : (
                        <></>
                      )
                    ) : board.ec <= board.relay3EcStart ? (
                      <div className="alert">
                        <span>EC ALERT</span>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {board.relay3Status === 0 ? (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => relayControl(b_id, 3, 1)}
                      disabled={
                        Disable ||
                        board.relay3EcStatus ||
                        board.relay3PhStatus ||
                        board.relay3TimerStatus
                      }
                    >
                      OFF
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      onClick={() => relayControl(b_id, 3, 0)}
                      disabled={
                        Disable ||
                        board.relay3EcStatus ||
                        board.relay3PhStatus ||
                        board.relay3TimerStatus
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
                          checked={board.relay3PhStatus}
                          onChange={(e) =>
                            relayControlPh(
                              e.preventDefault(),
                              board.b_id,
                              3,
                              "PH_STATUS",
                              board.relay3PhStatus
                            )
                          }
                        />
                      }
                      disabled={
                        Disable ||
                        board.relay3TimerStatus ||
                        board.relay3EcStatus
                      }
                      label="PH"
                    />

                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={board.relay3EcStatus}
                          onChange={(e) =>
                            relayControlEc(
                              e.preventDefault(),
                              board.b_id,
                              3,
                              "EC_STATUS",
                              board.relay3EcStatus
                            )
                          }
                        />
                      }
                      disabled={
                        Disable ||
                        board.relay3PhStatus ||
                        board.relay3TimerStatus
                      }
                      label="EC"
                    />

                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={board.relay3TimerStatus}
                          onChange={(e) =>
                            relayControlTimer(
                              e.preventDefault(),
                              board.b_id,
                              board.relay3TimerStatus,
                              3,
                              "TIMER_STATUS"
                            )
                          }
                        />
                      }
                      disabled={
                        Disable || board.relay3PhStatus || board.relay3EcStatus
                      }
                      label="TIMER"
                    />
                  </div>
                </div>
                {/* ******************* Ph ******************* */}
                {board.relay3PhStatus && (
                  <form className="mt-3 box-form">
                    <p>PH</p>
                    <div className="mb-3">
                      <label>START:</label>
                      <input
                        id="relay3PhStart"
                        defaultValue={board.relay3PhStart}
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
                        defaultValue={board.relay3PhStop}
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
                          relayControlPh(
                            e.preventDefault(),
                            board.b_id,
                            3,
                            "PH_SET_CONTROL",
                            board.relay3PhStatus
                          )
                        }
                      >
                        SET
                      </button>
                    </div>
                  </form>
                )}

                {/* ******************* EC ******************* */}

                {board.relay3EcStatus && (
                  <form className="mt-3 box-form">
                    <p>EC</p>
                    <div className="mb-3">
                      <label>START:</label>
                      <input
                        id="relay3EcStart"
                        defaultValue={board.relay3EcStart}
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
                        defaultValue={board.relay3EcStop}
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
                          relayControlEc(
                            e.preventDefault(),
                            board.b_id,
                            3,
                            "EC_SET_CONTROL",
                            board.relay3EcStatus
                          )
                        }
                      >
                        SET
                      </button>
                    </div>
                  </form>
                )}

                {/* ******************* Timer ******************* */}
                {board.relay3TimerStatus && (
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
                            relayControlTimer(
                              e.preventDefault(),
                              board.b_id,
                              board.relay3TimerStatus,
                              3,
                              "TIMER_SET",
                              board.relay3Timers.length
                            )
                          }
                          disabled={Disable}
                        >
                          SET
                        </button>
                        {board.relay3Timers.length > 0 && (
                          <button
                            id="set"
                            className="mt-2"
                            onClick={(e) => {
                              handleOpenTimer(3, e.preventDefault());
                            }}
                          >
                            SHOW TIMER :{board.relay3Timers.length}
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
                        <h2>TIMER RELAY 3</h2>
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
                              {board.relay3Timers.map((i, k) => {
                                return (
                                  <tr>
                                    <td>{k + 1}</td>
                                    <td>{i.startTime}</td>
                                    <td>{i.stopTime}</td>
                                    <td>
                                      {i.aDay.map((j, k) => {
                                        return (
                                          <>
                                            {i.aDay.length > 1 ? (
                                              k === i.aDay.length - 1 ? (
                                                <span>{j.days}</span>
                                              ) : (
                                                <span>{j.days},</span>
                                              )
                                            ) : (
                                              <span>{j.days}</span>
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
                                            relayControlTimerDelete(
                                              e.preventDefault(),
                                              b_id,
                                              3,
                                              i._id,
                                              "TIMER_DELETE"
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
                    RELAY ALERT
                  </p>

                  {board.relayAlertPhStatus ? (
                    board.relayAlertPhStart > board.relayAlertPhStop ? (
                      board.ph >= board.relayAlertPhStart ? (
                        <div className="alert">
                          <span>PH ALERT</span>
                        </div>
                      ) : (
                        <></>
                      )
                    ) : board.ph <= board.relayAlertPhStart ? (
                      <div className="alert">
                        <span>PH ALERT</span>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {board.relayAlertEcStatus ? (
                    board.relayAlertEcStart > board.relayAlertEcStop ? (
                      board.ec >= board.relayAlertEcStart ? (
                        <div className="alert">
                          <span>EC ALERT</span>
                        </div>
                      ) : (
                        <></>
                      )
                    ) : board.ec <= board.relayAlertEcStart ? (
                      <div className="alert">
                        <span>EC ALERT</span>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {board.relayAlertStatus === 0 ? (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => relayControl(b_id, 4, 1)}
                      disabled={Disable}
                    >
                      OFF
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      onClick={() => relayControl(b_id, 4, 0)}
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
                          checked={board.relayAlertPhStatus}
                          onChange={(e) =>
                            relayControlPh(
                              e.preventDefault(),
                              board.b_id,
                              4,
                              "PH_STATUS",
                              board.relayAlertPhStatus
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
                          checked={board.relayAlertEcStatus}
                          onChange={(e) =>
                            relayControlEc(
                              e.preventDefault(),
                              board.b_id,
                              4,
                              "EC_STATUS",
                              board.relayAlertEcStatus
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
                              board.b_id,
                              board.relayAlertWaterStatus,
                              4,
                              "TIMER_STATUS"
                            )
                          }
                        />
                      }
                      disabled={Disable}
                      label="PUMP"
                    />
                  </div>
                </div>
                {/* ******************* Ph ******************* */}
                {board.relayAlertPhStatus && (
                  <form className="mt-3 box-form">
                    <p>PH</p>
                    <div className="mb-3">
                      <label>START:</label>
                      <input
                        id="relayAlertPhStart"
                        defaultValue={board.relayAlertPhStart}
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
                        defaultValue={board.relayAlertPhStop}
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
                          relayControlPh(
                            e.preventDefault(),
                            board.b_id,
                            4,
                            "PH_SET_CONTROL",
                            board.relayAlertPhStatus
                          )
                        }
                      >
                        SET
                      </button>
                    </div>
                  </form>
                )}

                {/* ******************* EC ******************* */}

                {board.relayAlertEcStatus && (
                  <form className="mt-3 box-form">
                    <p>EC</p>
                    <div className="mb-3">
                      <label>START:</label>
                      <input
                        id="relayAlertEcStart"
                        defaultValue={board.relayAlertEcStart}
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
                        defaultValue={board.relayAlertEcStop}
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
                          relayControlEc(
                            e.preventDefault(),
                            board.b_id,
                            4,
                            "EC_SET_CONTROL",
                            board.relayAlertEcStatus
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
                            board.b_id,
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
        <h2>BOARD ID:{board.b_id}</h2>
      </div>
    );
  }
};

export default Default;
