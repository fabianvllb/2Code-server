//const { PrismaClient, Prisma } = require("@prisma/client");
const db = require("../models/db");
//const prisma = new PrismaClient();
const crypto = require("crypto");
var config = require("../config/server-config");
var jwt = require("jsonwebtoken");

const {
  app: { secret },
} = config;

module.exports = class User {
  constructor(email, firstname, lastname, username, role) {
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.username = username;
    this.role = role;
    this.timecreated = undefined;
    /*this.hash = undefined;
    this.salt = undefined;*/
  }

  async insertToDB() {
    let res = await db.query(
      "INSERT INTO public.user (email, firstname, lastname, username, timecreated) VALUES ($1, $2, $3, $4, $5)",
      [
        this.email,
        this.firstname,
        this.lastname,
        this.username,
        this.timecreated,
      ]
    );
    return res.rowCount;
  }

  setPassword(password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
      .toString("hex");
  }

  isCorrectPassword(password) {
    let hash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
      .toString("hex");
    if (crypto.timingSafeEqual(hash, this.hash)) {
      return true;
    } else {
      return false;
    }
  }

  generateJwt() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7); // expired after 7 days

    return jwt.sign(
      {
        _id: this._id,
        username: this.username,
        email: this.email,
        role: this.role,
        hash: this.hash, // include hash in token for 'remember me' function.
        exp: parseInt(expiry.getTime() / 1000),
      },
      secret
    );
  }

  static async findUserByEmail(email) {
    let data = await db.query("SELECT * FROM public.user WHERE email = $1", [
      email,
    ]);
    if (data.rows[0]) {
      let user = User.createUserFromObject(data.rows[0]);
      return user;
    } else {
      return null;
    }
  }

  static async findUserById(id) {
    let data = await db.query("SELECT * FROM public.user WHERE id = $1", [id]);
    if (data.rows[0]) {
      let user = User.createUserFromObject(data.rows[0]);
      return user;
    } else {
      return null;
    }
  }

  static createUserFromObject(obj) {
    let user = new User(
      obj.email,
      obj.firstname,
      obj.lastname,
      obj.username,
      obj.role
    );
    user.timecreated = obj.timecreated;
    user.hash = obj.hash;
    user.salt = obj.salt;
    return user;
  }

  /*get hash() {
    return this._hash;
  }

  set hash(password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this._hash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
      .toString("hex");
  }*/
  /*static findUserByUsername(username) {
    return prisma.user.findUnique({
      where: {
        username,
      },
    });
  }*/

  /*static getAllUsers(where) {
    if (where) {
      return prisma.user.findMany({ where });
    }
    return prisma.user.findMany();
  }

  static setPassword(password) {
    let salt = crypto.randomBytes(16).toString("hex");
    let hash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
      .toString("hex");
  }*/
};

/*
exports.createUser = (data) => {
  return prisma.user.create({ data });
};
exports.getUsers = (where, select = {}) => {
  return prisma.user.findMany({ where, select });
};
exports.getOneUser = (where, select = {}) => {
  return prisma.user.findUnique({ where, select });
};
exports.updateUser = () => {};
exports.deleteUser = () => {};
*/
