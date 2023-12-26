import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

export default function ButtonBaseDemo() {
  const navigate = useNavigate();

  const handleButtonClick = (route) => {
    navigate(route);
  };

  return (
    <div className="flex h-screen justify-center bg-slate-200">
      <div className="w-2/5 m-[5%] rounded-3xl bg-white shadow-lg">
        <div>
          <p className="text-black text-center text-2xl p-10">
            Detect explicit content within images for a safer online experience,
            helping users avoid inappropriate or offensive visuals.
          </p>
        </div>
        <div className="w-full p-4 rounded">
          <button
            className="w-3/4 h-64 relative overflow-hidden rounded-md focus:outline-none"
            onClick={() => handleButtonClick("/image-detection")}
            style={{
              backgroundImage: `url('./ExplicitImage.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "0.375rem",
            }}
          >
            .
          </button>
        </div>
      </div>
      <div className="w-2/5 m-[5%] rounded-3xl bg-white shadow-lg">
        <div>
          <p className="text-black text-center text-2xl p-10">
            Verify news authenticity and combat misinformation by identifying
            and flagging potentially misleading or fabricated news articles,
            promoting information accuracy.
          </p>
        </div>
        <div className="w-full p-4 rounded">
          <button
            className="w-3/4 h-64 relative overflow-hidden rounded-md focus:outline-none"
            onClick={() => handleButtonClick("/fake-news-detection")}
            style={{
              backgroundImage: `url('./Fake.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "0.375rem",
            }}
          >
            .
          </button>
        </div>
      </div>
    </div>
  );
}
