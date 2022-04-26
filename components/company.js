import { useState, useEffect } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
const Company = ({ Company, setSelect, getBoardCompany }) => {


  return (
    <>
      {Company.map((i) => {
        return (
          <button
            className="btn btn-outline-primary"
            onClick={() => (setSelect(i._id), getBoardCompany())}
          >
            {i.c_name}
          </button>
        );
      })}
    </>
  );
};

export default Company;
