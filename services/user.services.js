const User = require("../models/User");

exports.signupService = async (userInfo) => {
  const user = await User.create(userInfo);

  return user;
};

exports.findUserByEmail = async (email) => {
  // console.log(email);
  return await User.findOne({ email });
};

exports.findUserByToken = async (token) => {
  return await User.findOne({ confirmationToken: token });
};
