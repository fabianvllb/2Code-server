const db = require("../models/db");
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

  //User.createUserFromObject doesn't create a new user on the database.
  //It converts the obtained generic object returned by postgres into a User class object
  static createUserFromObject(obj) {
    let user = new User(
      obj.email,
      obj.firstname,
      obj.lastname,
      obj.username,
      obj.role
    );
    user.timecreated = obj.timecreated;
    if (obj.id) user.id = obj.id;
    /*user.hash = obj.hash;
    user.salt = obj.salt;*/
    return user;
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

  async updateToDB() {
    try {
      let res = await db.query(
        "UPDATE public.user SET email = $1, firstname = $2, lastname = $3, username = $4, role = $5 WHERE id = $6",
        [
          this.email,
          this.firstname,
          this.lastname,
          this.username,
          this.role,
          this.id,
        ]
      );
      return res.rowCount;
    } catch (err) {
      throw err;
    }
  }

  async delete() {
    try {
      let res = await db.query("DELETE FROM public.user WHERE id = $1", [
        this.id,
      ]);
      return res.rowCount;
    } catch (err) {
      throw err;
    }
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
    try {
      let data = await db.query("SELECT * FROM public.user WHERE email = $1", [
        email,
      ]);
      if (data.rowCount != 0) {
        //User.createUserFromObject doesn't create a new user on the database.
        //It converts the obtained generic object returned by postgres into a User class object
        let user = User.createUserFromObject(data.rows[0]);
        return user;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  static async findUserById(id) {
    try {
      let data = await db.query("SELECT * FROM public.user WHERE id = $1", [
        id,
      ]);
      if (data.rowCount != 0) {
        //User.createUserFromObject doesn't create a new user on the database.
        //It converts the obtained generic object returned by postgres into a User class object
        let user = User.createUserFromObject(data.rows[0]);
        return user;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  static async findUserByUsername(username) {
    try {
      let data = await db.query(
        "SELECT * FROM public.user WHERE username = $1",
        [username]
      );
      if (data.rowCount != 0) {
        //User.createUserFromObject doesn't create a new user on the database.
        //It converts the obtained generic object returned by postgres into a User class object
        let user = User.createUserFromObject(data.rows[0]);
        return user;
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  static async findAllFilterByRole(role) {
    try {
      let data = await db.query(
        "SELECT * FROM public.user WHERE role = $1 ORDER BY id",
        [role]
      );
      return data.rows;
    } catch (err) {
      throw err;
    }
  }

  static async getAllUserProblems(userid) {
    let data = await db.query(
      "SELECT id,title,description,difficulty,active,timecreated FROM public.problem WHERE authorid = $1",
      [userid]
    );
    return data.rows;
  }

  static async getAllUsers() {
    try {
      let data = await db.query(
        "SELECT id, email, firstname, lastname, username, role FROM public.user ORDER BY role, id"
      );
      return data.rows;
    } catch (err) {
      throw err;
    }
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
