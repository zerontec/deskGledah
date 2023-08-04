/* eslint-disable object-shorthand */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");
const { User } = require('../db');
// const {SECRET} = process.env;




verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];
  
    if (!token) {
      return res.status(403).send({
        message: "No se Recibio Token!"
      });
    }
  
    jwt.verify(token, '97124zerontec', (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "No Autorizado!"
        });
      }
      req.userId = decoded.id;
      next();
    });
  };
  

  isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }
  
  
        res.status(403).send({
          message: "Require Admin Role!"
        });
        // eslint-disable-next-line no-useless-return
        return;
      });
    });
  }

  

  isUserTl = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
      user.getRoles().then(roles => {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "vendedor") {
            next();
            return;
          }
        }
  
        res.status(403).send({
          message: "Require User Take love Role!"
        });
      });
    });
  };

  isUserGl = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "facturacion") {
            next();
            return;
          }
        }
  
        res.status(403).send({
          message: "Require User Give Love Role!"
        });
      });
    });
  };

 

  isGlOrTl = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "usergl") {
            next();
            return;
          }
  
          if (roles[i].name === "usertl") {
            next();
            return;
          }
        }
  
        res.status(403).send({
          message: "Require usergl or usertl Role!"
        });
      });
    });
  };

  const isAdminOrFacturacion = (req, res, next) => {
    User.findByPk(req.userId).then((user) => {
      user.getRoles().then((roles) => {
        const roleNames = roles.map((role) => role.name);
        if (roleNames.includes("admin") || roleNames.includes("facturacion")) {
          next();
        } else {
          res.status(403).send({
            message: "Require Admin or Facturacion Role!",
          });
        }
      });
    });
  };

  const authJwt = {
    // eslint-disable-next-line object-shorthand
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isUserGl: isUserGl,
    isUserTl: isUserTl,
    isGlOrTl: isGlOrTl,
    isAdminOrFacturacion :isAdminOrFacturacion
  };
  module.exports = authJwt;
  