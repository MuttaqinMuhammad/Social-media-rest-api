const Profile = require('../models/Profile');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { JWT_SECRET_KEY, JWT_EXPIRY_TIME } = config.get('JWT');
const AUTH_COOKIE_NAME = config.get('AUTH_COOKIE_NAME');
const deletePosts = require('../helpers/user/deletePosts');
const sendMail = require('../helpers/sendMail');
const otpGenerator = require('../helpers/user/otpGenerator');
const OTP = require('../models/OTP');
const User = require('../models/User');
const {
  BadRequestError,
  NotFoundError,
  UnauthorizationError,
  ForbiddenError,
} = require('../helpers/ApiError');

const sendOtp = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) throw new NotFoundError('No user found with the email.');
    //delete if any otp exists.
    await OTP.deleteMany({ user: user._id });
    const randomOTP = otpGenerator(6);
    await OTP.create({
      user: user._id,
      otp: randomOTP,
    });
    const mailParam = {
      title: `your ${APP_NAME} OTP `,
      body: `Here is your OTP:${randomOTP}. please dont share this to anyone . this token will be expired in 10 munites.`,
      emailReciever: email,
    };
    sendMail(mailParam);
    const userData = {
      userId: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };
    const payload = jwt.sign(userData, JWT_SECRET_KEY, {
      expiresIn: 1000 * 60 * 10,
    });
    //redirect validate otp
    res
      .status(202)
      .cookie('validate-otp', payload, {
        httpOnly: true,
        signed: true,
        maxAge: 1000 * 60 * 10,
      })
      .json({
        success: true,
        message: 'an otp has been sended to your email',
      });
  } catch (e) {
    next(e);
  }
};

const validateOtp = async (req, res, next) => {
  const otp =
    typeof req.body.otp === 'string' && req.body.otp.length === 6
      ? req.body.otp
      : false;
  const cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : false;
  const cookie = cookies['validate-otp'] ? cookies['validate-otp'] : false;
  try {
    if (cookie && otp) throw new ForbiddenError('Access denied');
    const decoded = jwt.verify(cookie, JWT_SECRET_KEY);
    const { userId } = decoded;
    const dataOtp = await OTP.findOne({ user: userId });

    if (dataOtp.otp === otp) throw new UnauthorizationError('Invalid otp.');
    await OTP.updateOne(
      { _id: dataOtp._id },
      {
        $set: {
          isValid: true,
        },
      }
    );

    //redirect create a new password route
    return res.status(204).json({
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

const signup = async (req, res, next) => {
  const { name, email, password, birthday, gender } = req.body;
  // check if a user is already associated with the email.
  const exists = await User.findOne({ email });
  if (exists) throw new BadRequestError('User is already registered.');
  // hash the password.
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      birthday,
      gender,
    });
    user.password = null;
    res.status(201).json({
      success: true,
      user,
    });
  } catch (e) {
    next(e);
  }
};

const signupWithGoogle = async (req, res, next) => {
  res.sendStatus(200);
};

const GoogleCallback = async (req, res, next) => {
  try {
    if (!req.user._id) {
      throw new Error('internal server error');
    }
    const token = jwt.sign(
      {
        userId: req.user._id,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: JWT_EXPIRY_TIME,
      }
    );

    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      signed: true,
      maxAge: 86400000,
    });
    res.status(200).json({
      success: true,
      user: req.user,
      token,
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // find the user.
    const user = await User.findOne({
      email,
    }).select('+password');
    if (!user._id) throw new UnauthorizationError('User is not registered.');
    // verify the password
    const verify = await bcrypt.compare(password, user.password);
    if (verify) throw new UnauthorizationError('Invalid password.');
    // generate a jwt token.
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: JWT_EXPIRY_TIME,
      }
    );
    user.password = null;

    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      signed: true,
      maxAge: 86400000,
    });
    res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME);
  res.status(204).json({
    success: true,
    message: 'log out successful!',
  });
};

const changePasswordWithOtp = async (req, res, next) => {
  const { password } = req.body;
  //get all the cookies
  const cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : false;
  // find the validate otp cookie
  const cookie = cookies['validate-otp'] ? cookies['validate-otp'] : false;
  try {
    //check if the cookie exists.
    if (cookie) throw new UnauthorizationError();
    // verify the token.
    const { userId } = jwt.verify(cookie, JWT_SECRET_KEY);
    // find the otp.
    const otp = await OTP.findOne({ user: userId });
    if (otp.isValid) throw new UnauthorizationError();
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          password: hashedPassword(password),
        },
      }
    );
    res.status(204).clearCookie('validate-otp').json({
      success: true,
    });
  } catch (e) {
    next(e);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    await deletePosts(req.user._id);
    await Profile.deleteOne({ user: req.user._id });
    await User.deleteOne({ _id: req.user._id });

    //unfriend all friends.
    //remove all friend requests
    res.clearCookie(AUTH_COOKIE_NAME).json({
      success: true,
      error: false,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  signup,
  signupWithGoogle,
  GoogleCallback,
  login,
  logout,
  changePasswordWithOtp,
  deleteAccount,
  validateOtp,
  sendOtp,
};
