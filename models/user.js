const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = class User {
  constructor(email, username, nombre, apellidos, tipo, createdAt) {
    this.email = email;
    this.username = username;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.tipo = tipo;
    this.createdAt = createdAt;
    this.problems = [];
    this.submissions = [];
  }

  async create() {
    let data = await prisma.problem.create({ data: this });
    this.id = data.id;
  }

  static findUserByUsername(username) {
    return prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  static getAllUsers(where) {
    if (where) {
      return prisma.user.findMany({ where });
    }
    return prisma.user.findMany();
  }
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
