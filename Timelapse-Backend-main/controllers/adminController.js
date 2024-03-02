const userService = require("../services/userService");
const structures = require("../_helpers/structures");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const appConfig = require("../config/app.config.js");

const { body, validationResult } = require("express-validator");
const customValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return {
      message: error.msg,
    };
  },
});

exports.getUser = async (req, res, next) => {
  let user = await userService.getByEmail(req.email);
  if (user) {
    return res.json(structures.users(user, req.accessToken));
  } else {
    const err = { code: 404, message: "Oops! User not found." };
    next(err);
  }
};

exports.signUp = async (req, res, next) => {
  const errors = customValidationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json(errors.array()[0]);
    return;
  }

  const token = jwt.sign({ email: req.body.email }, appConfig.JWT_SIGNING_KEY, {
    expiresIn: appConfig.JWT_EXPIRY,
  });

  let newUser = { email: req.body.email, password: req.body.password };
  try {
    newUser = await userService.create(newUser);
    return res.json(structures.users(newUser, token));
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const errors = customValidationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json(errors.array()[0]);
    return;
  }

  try {
    let user = await userService.getPasswordByEmail(req.body.email);
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        let user = await userService.getByEmail(req.body.email);
        const token = jwt.sign(
          { user },
          appConfig.JWT_SIGNING_KEY,
          { expiresIn: appConfig.JWT_EXPIRY }
        );
        return res.json(
          structures.users(await userService.getById(user.id), token)
        );
      } else {
        const err = {
          code: 401,
          message: "Oops, these credentials do not match!",
        };
        next(err);
      }
    } else {
      const err = { code: 404, message: "This email is not registered!" };
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

exports.checkLogin = async (req, res, next) => {
  const errors = customValidationResult(req);
  if(!errors.isEmpty()) {
    res.status(422).json(errors.array())[0];
    return;
  }

  try {
    let { user } = jwt.decode(req.body._token);
    return res.json(
      structures.users(user, req.body._token)
    );
  } catch (err) {
    next(err);
  }
}

exports.validate = (method) => {
  switch (method) {
    case "signup":
      return [
        body("email", "Invalid email provided!").exists().isEmail(),
        body("password", "Password does not exist").exists(),
      ];
      break;
    case "login":
      return [
        body("email", "Invalid email provided!").exists().isEmail(),
        body("password", "Password does not exist").exists(),
      ];
    case "check_login":
      return [
        body("_token", "Token does not exist").exists()
      ];
      break;
  }
};

exports.getUserListWithPagination = async (req, res, next) => {
  const params = req.body.params;
  const users = await userService.getUserListWithPagination(params);
  const totalCount = await userService.getUserListTotalCount(params);
  return res.json({ users, totalCount });
}

exports.deleteUser = async (req, res, next) => {
  const id = req.body.id;
  await userService.delete(id);
  return res.json({ code: 200, success: true });
}

exports.updateUser = async (req, res, next) => {
  const user = req.body.user;
  return res.json(await userService.update(user._id, user));
}