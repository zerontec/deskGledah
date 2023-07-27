/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable vars-on-top */
/* eslint-disable consistent-return */
// eslint-disable-next-line import/order
const { User, Role } = require("../db");
const bcrypt = require("bcryptjs");

const { SECRET } = process.env;
const Op = require("sequelize").Op;
const jwt = require("jsonwebtoken");

// register User

const registerUser = async (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);


  User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: hash,
  })
  

    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: "Usuario registrado satisfactoriamente" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([2]).then(() => {
          res.send({ message: "Usuario registrado satisfactoriamente" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const loginUser = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Usuario o Password invalido." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Usuario o Password invalido !",
        });
      }

      const token = jwt.sign({ id: user.id }, '97124zerontec', {
        expiresIn: 86400, // 24 hours
      });

      const authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          // eslint-disable-next-line prefer-template
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
      next(err)
    });
};

module.exports = {
  registerUser,
  loginUser,
};