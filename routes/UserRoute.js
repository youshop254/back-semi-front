const route = require("express").Router();
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const verify = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const sendEmail = require("./SendMail");
const authAdmin = require("../middleware/authAdmin");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const client = new OAuth2(process.env.MAILING_SERVICE_ID);

const { CLIENT_URL } = process.env;

route.post(
  "/api/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.json({ msg: "registration fields cannot be empty" });
    }

    const userEmail = await User.findOne({ email });
    if (userEmail)
      return res.json({ msg: "email exists! Register with a new email" });

    if (password.length < 6)
      return res.json({ msg: "password cannot be less that 6 characters" });

    // const user = {name, email, password}
    const rounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, rounds);

    const newUser = {
      name,
      email,
      password: hashedPassword,
    };

    const activationToken = createActivationToken({ newUser });
    // console.log({activationToken})

    const url = `${CLIENT_URL}/user/activate_email/${activationToken}`;
    sendEmail(email, url, "verify your email address");

    // const accessToken = jwt.sign(
    //   { id: user._id },
    //   process.env.ACCESS_TOKEN_SECRET,
    //   { expiresIn: 60 * 60 }
    // );

    // const refreshToken = createRefreshToken({ id: user._id })
    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   path: '/api/refresh_token'
    // })

    res.json({
      msg: "Please go to your email account to register your account.",
    });

    // res.json({user, accessToken});

    // res.json(user)
  })
);

route.post(
  "/api/activate_email",
  asyncHandler(async (req, res) => {
    const { activation_token } = req.body;
    const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN);
    console.log(user);

    await User.create(user.newUser);

    res.json({ msg: "account has been succesfully activated" });
  })
);

route.post(
  "/api/refresh_token",
  asyncHandler(async (req, res) => {
    const rf_token = req.cookies.refreshToken;

    if (!rf_token) return res.json({ msg: "please log in or register" });

    jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user) => {
      if (err) return res.json({ msg: "please log in or register" });
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 60 * 60 }
      );

      res.json(accessToken);
    });

    // res.json(rf_token)
  })
);

route.post(
  "/api/login",
  asyncHandler(async (req, res) => {
    try {
    const { email, password } = req.body;

    // if (!email || !password) {
    //   res.json({
    //     msg: "name or email cannot be empty.",
    //   });
    // }

    const user = await User.findOne({ email });

    if (!user)
      return res.json({
        msg: "Email does not exist. Please create an account, if you do not have one.",
      });

    const matched = await bcrypt.compare(password, user.password);

    if (matched) {
      // const accessToken = jwt.sign(
      //   { id: user._id },
      //   process.env.ACCESS_TOKEN_SECRET,
      //   { expiresIn: 60 * 60 }
      // );

      if (!matched) return res.json({ msg: "check your password again" });

      const refreshToken = createRefreshToken({ id: user._id });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/api/refresh_token",
      });

      res.json(user);

      // const { password, ...info } = user._doc;
      // res.json({...info, accessToken});
    } else {
      res.json({
        message:
          "something went wrong, try again. hint! check if your password or email is correct",
      });
    }} catch(err){
      return res.json({msg: err.message})
    }
  })
);

route.post(
  "/api/logout",
  asyncHandler(async (req, res) => {
    res.clearCookie("refreshToken", { path: "/api/refresh_token" });
    return res.json({ msg: "logged out" });
  })
);

route.post(
  "/api/forgot_password",
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.json({ msg: "this email does not exist in our system" });

    const access_token = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 60 * 60 }
    );

    const url = `${CLIENT_URL}/user/reset/${access_token}`;

    sendEmail(email, url, "reset your password");

    res.json({ msg: "check your email account to reset your password" });
  })
);

route.post(
  "/api/reset_password",
  verify,
  asyncHandler(async (req, res) => {
    const { password } = req.body;

    const passwordHash = await bcrypt.hash(password, 12);

    console.log(req.user);

    await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        password: passwordHash,
      }
    );

    res.json({ msg: "password successfully changed" });
  })
);

route.get(
  "/api/user",
  verify,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.json({ msg: "user does not exist" });

    res.json(req.user);
  })
);

route.post(
  "/api/get_all_users",
  verify,
  authAdmin,
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");

    res.json({ users });
  })
);

route.post(
  "/api/delete_user/:id",
  verify,
  authAdmin,
  asyncHandler(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);

    res.json({ msg: "user successfully deleted" });
  })
);

route.post(
  "/api/google_login",
  asyncHandler(async (req, res) => {
    const { tokenId } = req.body;

    const verify = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.MAILING_SERVICE_ID,
    });

console.log(verify)

const {email_verified, email, name} = verify.payload

const password = email + process.env.GOOGLE_SECRET

const passwordHash = await bcrypt.hash(password, 12)

if(!email_verified) return res.json({msg: "email is not verified.."})



  const user = await User.findOne({email})

  if(user) {
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch)  return res.json({msg: "Password is incorrect"})

    const refreshToken = createRefreshToken({ id: user._id });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/api/refresh_token",
      });

      res.json({msg: "login has been a success"})

  }

 else {

  const newUser = await User.create({
    name,
    email,
    password: passwordHash

  })

  const refreshToken = createRefreshToken({ id: newUser._id });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/api/refresh_token",
      });

      res.json({msg: "login has been a success"})


}


  })
);

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN, { expiresIn: 80 * 80 });
};

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN, { expiresIn: "1d" });
};

module.exports = route;
