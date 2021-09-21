import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import "./styles.css";
import Button from "@mui/material/Button";
import { dataToBeShown } from "./constant";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary
}));

export default function App() {
  const [isLandscape, setIsLandscape] = useState(false);

  const [userData, setUserData] = useState();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkOrientation();
    window.addEventListener("orientationchange", checkOrientation);
  });

  const checkOrientation = () => {
    if (window.matchMedia("(orientation: landscape)").matches) {
      setIsLandscape(true);
    } else if (window.matchMedia("(orientation: portrait)").matches) {
      setIsLandscape(false);
    }
  };

  const successCallBack = async (position) => {
    const { latitude, longitude } = position.coords;
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=1c691fc6e3f94761b93e96943e0d18dc`
    );
    const userLocation = await response.json();
    setUserData(userLocation.results[0]);
  };

  const failureCallBack = (error) => {
    console.log("Error ===>", error);
  };

  const getUserLocation = () => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        successCallBack,
        failureCallBack
      );
    }
  };

  const text = !showDetails ? "Want more details?" : "Hide details.";
  return (
    <div className="main">
      {isLandscape ? (
        <div>
          <div className="App">
            <div className="flex-container">
              <h1 className="title">Where Am I? </h1>{" "}
              <Button variant="contained" onClick={() => getUserLocation()}>
                Get your Location
              </Button>
            </div>
            {userData && <h1>{userData.formatted}</h1>}
          </div>
          {userData &&
            showDetails &&
            dataToBeShown.map((data) => {
              let flag = false;
              Object.keys(userData.components).forEach((i) => {
                if (data === i && userData.components[data]) {
                  flag = true;
                }
              });
              return (
                <>
                  {flag && (
                    <h3>
                      {data}: {userData.components[data]}
                    </h3>
                  )}
                </>
              );
            })}
          {userData && (
            <div className="more-details">
              <Grid container spacing={0.5}>
                <Item>{text}</Item>{" "}
                <Button
                  variant="text"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  Click here
                </Button>
              </Grid>
            </div>
          )}
        </div>
      ) : (
        <h1>Please rotate your phone!</h1>
      )}
    </div>
  );
}
