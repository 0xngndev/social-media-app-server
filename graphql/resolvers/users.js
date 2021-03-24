const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const checkAuth = require("../../util/check-auth");
const { validateRegister, validateLogin } = require("../../util/validators");
const { UserInputError } = require("apollo-server-errors");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.SECRET_KEY,
    { expiresIn: "3h" }
  );
};

module.exports = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.find({}).sort({ createdAt: -1 });
        return users;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    register: async (_, { registerInput: { username, email, password } }) => {
      const { valid, errors } = validateRegister(username, email, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const [inUseEmail, user] = await Promise.all([
        User.findOne({ email }),
        User.findOne({ username }),
      ]);

      if (inUseEmail) {
        throw new UserInputError("Email is taken", {
          errors: {
            email: "This Email is taken",
          },
        });
      }
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },

    login: async (_, { username, password }, context) => {
      const { valid, errors } = validateLogin(username, password);
      if (!valid) {
        throw new UserInputError("Error: ", { errors });
      }
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong Credentials";
        throw new UserInputError("Wrong Credentials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    followUser: async (_, { userId }, context) => {
      const user = checkAuth(context);
      if (!user) {
        throw new AuthenticationError("You must be logged in to follow users");
      }
      const followedUser = await User.findById(userId);
      if (followedUser) {
        if (
          followedUser.followers.find(
            (follower) => follower.username === user.username
          )
        ) {
          followedUser.followers = followedUser.followers.filter(
            (follower) => follower.username !== user.username
          );
        } else {
          followedUser.followers.push({
            id: user.id,
            username: user.username,
          });
        }
        await followedUser.save();
        return followedUser;
      } else throw new UserInputError("User not found");
    },
  },
};
