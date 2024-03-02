const userService = require("../services/userService");
const structures = require("../_helpers/structures");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const appConfig = require("../config/app.config.js");
const http = require('http');

const { body, validationResult } = require("express-validator");
const customValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return {
      message: error.msg,
    };
  },
});

exports.signup = async function(req, res, next) {
  const { email } = req.body;
  let user = await userService.getUserByCondition({ email });
  if(user)
    return res.json({ code: 400, message: "This account was registered already", success: false });
  try {
    let response = await userService.create(req.body);
    return res.json({ code: 200, message: "Success to register", success: true });
  } catch (err) {
    return res.json({ code: 400, message: "Failed to register", success: false });
  }
}

exports.oauth = async function (req, res, next) {
  const { email, given_name, family_name, sub } = req.body;
  let user = await userService.getUserByCondition({ email });
  if(!user)
    await userService.create({ email, first_name: given_name, last_name: family_name, is_verified: true, role: 0, sub: sub });
  user = await userService.getUserByCondition({ email });
  if(user.is_deleted)
    return res.json({ code: 400, message: "This account was suspended.", success: false });

  if(!user.sub)
      return res.json({ code: 400, message: "This account was registered as normal account. Please join with manual way", success: false });

  const token = jwt.sign(
    { 
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_verified: user.is_verified
    },
    appConfig.JWT_SIGNING_KEY,
    { expiresIn: appConfig.JWT_EXPIRY }
  );

  return res.json(
    structures.users(await userService.getById(user.id), token)
  );
}

exports.login = async function (req, res, next) {
  const errors = customValidationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json(errors.array()[0]);
    return;
  }
  try {
    let user = await userService.getUserPasswordByEmail(req.body.email);
    if(user) {
      if(user.sub)
        return res.json({ code: 400, message: "This is Social Account. Please join with social", success: false });

      if(user.is_deleted)
        return res.json({ code: 400, message: "This account was suspended.", success: false });
      else {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let user = await userService.getByEmail(req.body.email);
          const token = jwt.sign(
            { 
              _id: user._id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              is_verified: user.is_verified
            },
            appConfig.JWT_SIGNING_KEY,
            { expiresIn: appConfig.JWT_EXPIRY }
          );

          return res.json(
            structures.users(await userService.getById(user.id), token)
          );
        } else {
          const err = {
            code: 401,
            message: "This credential does not match.",
            success: false
          };
          return res.json(err);
        }
      }
    } else {
      const err = { code: 404, message: "This email is not registered.", success: false };
      return res.json(err);
    }
  } catch (err) {
    return res.json(err);
  }
}

exports.check_login = async function (req, res, next) {
  const errors = customValidationResult(req);
  if(!errors.isEmpty()) {
    res.status(422).json(errors.array())[0];
    return;
  }
  try {
    let { _id, email, first_name, last_name, is_verified, iat, exp } = jwt.decode(req.body._token);
    if(iat > exp) {
      return res.json({ code: 400, success: false, message: 'Session is expired.' });
    } else {
      return res.json(
        structures.users({ _id, email, first_name, last_name, is_verified }, req.body._token)
      );
    }
  } catch (err) {
    console.log(err);
    return res.json({ code: 401, success: false, message: "Token is not valid" });
  }
}

exports.verifiedUser = async (req, res, next) => {
  const { _id } = req.body;
  try {
    const user = await userService.update(_id, { is_verified: true });
    const token = jwt.sign(
      { 
        _id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        is_verified: user.is_verified
      },
      appConfig.JWT_SIGNING_KEY,
      { expiresIn: appConfig.JWT_EXPIRY }
    );
    return res.json(
      structures.users(await userService.getById(user.id), token)
    );
  } catch (err) {
    console.log(err);
  }
}

exports.resetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const response = await userService.resetPassword(email);
    if(response) {
      return res.json({ code: 200, success: true });
    } else {
      return res.json({ code: 400, success: false });
    }
  } catch (err) {
    return res.json({ code: 400, success: false });
  }
}