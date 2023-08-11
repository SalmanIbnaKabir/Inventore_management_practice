const {
  signupService,
  findUserByEmail,
  findUserByToken,
} = require("../services/user.services");

const { generateToken } = require("../utils/token");

exports.signup = async (req, res) => {
  try {
    const user = await signupService(req.body);

    const token = user.generateConfirmationToken();

    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      status: "success",
      message: "Successfully signed up",
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Error in signup process",
      error: error.message,
    });
  }
};

/**
 * 1. Check if Email and password are given;
 * 2. Load user with Email;
 * 3. If not user sed res;
 * 4. compare password
 * 5. if password not correct send res
 * 6. check if user is active
 * 7. if not active send res
 * 8. send user and token
 *   */

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);
    if (!email || !password) {
      return res.status(401).json({
        status: "failed",
        error: "Please provide you credentials",
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        status: "failed",
        error: "No user found, Please create an account",
      });
    }

    const isPasswordValid = user.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        status: "failed",
        error: "password is not a valid password",
      });
    }

    if (user.status != "active") {
      return res.status(401).json({
        status: "failed",
        error: "Your account is not active",
      });
    }

    const token = generateToken(user);

    const { password: pwd, ...others } = user.toObject();

    res.status(201).json({
      status: "success",
      message: "Successfully logged in",
      data: {
        user: others,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Error in signup process",
      error: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await findUserByEmail(req.user?.email);

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      error: error.message,
    });
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await findUserByToken(token);

    if (!user) {
      return res.status(403).json({
        status: "failed",
        error: "Invalid token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);
    if (expired) {
      return res.status(401).json({
        status: "failed",
        error: "Token expired",
      });
    }

    user.status = "active";
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;
    user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "Successfully Activated Your account",
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      error: error.message,
    });
  }
};
