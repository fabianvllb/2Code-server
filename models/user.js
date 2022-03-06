const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

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
