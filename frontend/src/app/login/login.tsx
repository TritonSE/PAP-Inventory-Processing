// Login.tsx

import React from "react";
import Image from "next/image";
import "src/app/login/Login.css";

const Login = () => {
  return (
    <body>
      <div className="login-container">
        <Image
          src="/Images/login_bg.png"
          alt=""
          layout="fill"
          priority
          /* Inline styling due to using Image Component*/
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            filter: "brightness(10%)",
            opacity: "0.5",
          }}
        />
        <div className="login-box">
          <div className="logo-container">
            <div className="logo-image">
              <Image src="/Images/LoginImage.png" alt="Logo" width={190} height={90} />
            </div>
          </div>
          <div className="welcome-text">Welcome!</div>
          <form className="login-form">
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="e.g. John Doe" />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Password" />
            </div>
            <div className="forgot-password">Forgot Password?</div>
            <button className="login-button">Log In</button>
          </form>
        </div>
      </div>
    </body>
  );
};

export default Login;
