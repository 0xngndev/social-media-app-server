module.exports.validateRegister = (username, email, password) => {
  const errors = {};
  const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (username.trim() === "") {
    errors.username = "Username can't be empty";
  }

  if (password.trim() === "") {
    errors.password = "Password can't be empty";
  }

  if (email.trim() === "") {
    errors.email = "Email must can't be empty";
  }

  if (!email.match(regEx)) {
    errors.email = "Email must be a valid email address";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLogin = (username, password) => {
  const errors = {};

  if (username.trim() === "") {
    errors.username = "Username can't be empty";
  }

  if (password.trim() === "") {
    errors.password = "Password can't be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
