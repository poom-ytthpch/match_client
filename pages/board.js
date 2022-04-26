import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import Boards from "../components/boards";
import Company from "../components/company";
import Cookies, { set } from "js-cookie";
import jwt from "jsonwebtoken";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
const Swal = require("sweetalert2");
export default function Board() {
  const [boards, setBoards] = useState([]);
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bLoading, setBLoading] = useState(true);
  const [NonBoard, setNonBoard] = useState(true);
  const [company, setCompany] = useState([]);
  const [select, setSelect] = useState("");
  const [b_Select, setB_Select] = useState("");
  const [comId, setComId] = useState("");
  const [getAll, setGetAll] = useState(false);
  const [age, setAge] = React.useState("");

  // const server = "https://boardapi.herokuapp.com";
  // const server = "https://www.matchchemical.tk:57524";
  // const server = "http://localhost:4002";
  // const server = "http://localhost:4008/v1";
  const server = "https://home420.trueddns.com:57527/v1";

  const usServer = "https://userlogapi.herokuapp.com"; //userServer
  // const usServer = "https://www.matchchemical.tk:57521";

  useEffect(() => {
    const Verify = async () => {
      await getDeviceData();
      // await getCompany();
      // await getBoardCompany();
      await boardCheck();
    };
    const gProduct = setInterval(() => {
      filterBoard();
      Verify();
    }, 1000);

    return () => {
      clearInterval(gProduct);
    };
  }, [boards]);

  const getDeviceData = async () => {
    try {
      await axios
        .get(`${server}/getDeviceData/${Cookies.get("_id_")}`, {
          headers: {
            "x-access-token": Cookies.get("_t_"),
          },
        })
        .then((res) => {
          setLoading(false);
          if (res.data && b_Select === "") {
            setB_Select(res.data.model[0].name);
          }
          setBoards(res.data.model);
          if (b_Select !== "") {
            setBLoading(false);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const filterBoard = () => {
    setBoard(
      boards.filter((val) => {
        return val.name === b_Select;
      })
    );
  };

  const getBoard = (all) => {
    axios.get(`${server}/boards`).then((res) => {
      setBoards(res.data);
      setGetAll(all);
    });
  };

  const boardCheck = () => {
    if (boards.length === 0) {
      setNonBoard(false);
    }
  };

  const getCompany = () => {
    axios.get(`${usServer}/company`).then((res) => {
      setCompany(res.data);
    });
  };
  const getBoardCompany = async () => {
    const tmpToken = await Cookies.get("token");
    const decode = await jwt.decode(tmpToken);
    await setComId(decode.c_id);
    if (!decode.c_id) {
      setLoading(false);
      if (select !== "") {
        await axios
          .post(`${server}/getBoardCompany`, { c_id: select })
          .then((res) => {
            if (res.data) {
              setBoards(res.data);
            } else {
              setLoading(false);
            }
          })
          .catch(function (error) {
            setLoading(false);
          });
      }
    } else {
      await axios
        .post(`${server}/getBoardCompany`, { c_id: decode.c_id })
        .then((res) => {
          if (res.data) {
            setBoards(res.data);
            setLoading(false);
          }
          if (res.data.length === 0) {
            setBLoading(false);
          }
          if (res.data && b_Select === "") {
            setB_Select(res.data[0].b_name);
            // setBLoading(false);
          }
          if (b_Select !== "") {
            setBLoading(false);
          }
        })
        .catch(function (error) {
          // handle error
        });
    }
  };

  const handleSelectChange = (event) => {
    const wait = Swal.fire({
      title: "PLEASE WAIT!",
      timerProgressBar: true,
      timer: 1000,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    setB_Select(event.target.value);
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
        {/* <h1>Board Page</h1> */}
        <div className="box_board">
          <div>
            {comId === null && (
              <>
                {/* <button
                  className="btn btn-outline-primary"
                  onClick={() => getBoard(!getAll)}
                >
                  SHOW ALL
                </button> */}
                <Company
                  Company={company}
                  setSelect={setSelect}
                  getBoardCompany={getBoardCompany}
                />
              </>
            )}

            {boards !== 0 && (
              <div style={{ textAlign: "center" }}>
                <Box
                  style={{
                    borderColor: "white",
                    outlineColor: "white",
                    color: "white",
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel
                      style={{
                        borderColor: "white",
                        outlineColor: "white",
                        color: "white",
                      }}
                    >
                      BOARDS
                    </InputLabel>
                    <Select
                      className="select mb-2"
                      value={b_Select}
                      onChange={handleSelectChange}
                    >
                      {boards.map((i) => {
                        return (
                          <MenuItem
                            className="option"
                            key={i.device_id}
                            value={i.name}
                          >
                            {i.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Box>
                {bLoading || NonBoard ? (
                  <div className="mt-5">
                    <img src="./loading.gif" />
                  </div>
                ) : (
                  <>
                    {boards.length !== 0 ? (
                      <Boards boards={board} />
                    ) : (
                      <div>
                        <h1>No Board Active</h1>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
