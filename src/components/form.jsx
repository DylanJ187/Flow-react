import React, { useState } from "react";
import lightBackgroundURL from "./../background-images/light-background-default.jpg";
import { useForm } from "react-hook-form";
import { Box, Typography, useTheme, Link, Button } from "@mui/material";
import { tokens } from "../theme";

export default function Form() {
  const [isSignIn, setIsSignIn] = useState(true); // Default to Sign In page

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <Box
      className="container"
      sx={{ width: "100vw", height: "100vh", display: "flex" }}
    >
      <Box
        className="column"
        sx={{
          width: "35vw",
          margin: "auto",
          padding: "3em 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="logoLarge"
          color={colors.grey[100]}
          fontWeight="bold"
          alignItems="center"
          sx={{ userSelect: "none" }}
        >
          FLOW.
        </Typography>
        <Box
          component="form"
          id="form"
          className="flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: "320px",
            margin: "2em auto",
            display: "flex",
            flexDirection: "column",
            gap: "1em",
          }}
        >
          {!isSignIn && (
            <input
              type="text"
              {...register("name")}
              placeholder="name"
              autoComplete="off"
              style={{
                border: "1px solid #e9ecef",
                padding: ".9em 1em",
                "&:focus": {
                  outline: "none",
                },
              }}
            />
          )}
          <input
            type="text"
            {...register("username")}
            placeholder="username"
            autoComplete="off"
            style={{
              border: "1px solid #e9ecef",
              padding: ".9em 1em",
              "&:focus": {
                outline: "none",
              },
            }}
          />
          <input
            type="text"
            {...register("password")}
            placeholder="password"
            autoComplete="off"
            style={{
              border: "1px solid #e9ecef",
              padding: ".9em 1em",
              "&:focus": {
                outline: "none",
              },
            }}
          />
          {!isSignIn && (
            <input
              type="text"
              {...register("confirmpwd")}
              placeholder="confirm password"
              autoComplete="off"
              style={{
                border: "1px solid #e9ecef",
                padding: ".9em 1em",
                "&:focus": {
                  outline: "none",
                },
              }}
            />
          )}
          <Button
            href="/"
            sx={{
              color: "#e9ecef",
              fontSize: "1em",
              cursor: "pointer",
              border: "1px solid #e9ecef",
              padding: ".9em 1em",
            }}
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>

          {isSignIn ? (
            <Link sx={{ cursor: "pointer" }} onClick={() => setIsSignIn(false)}>
              Don't have an account? Sign up.
            </Link>
          ) : (
            <Link sx={{ cursor: "pointer" }} onClick={() => setIsSignIn(true)}>
              Already have an account? Sign in.
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  );
}
