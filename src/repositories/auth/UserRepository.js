const Users = require("../../models/users/Users");
const Role = require("../../models/auth/Role");
const { Op } = require("sequelize");

class UserRepository {
  async findByEmail(email) {
    return Users.findOne({
      where: { correo: email },
      include: [
        {
          model: Role,
          as: "rol",
          attributes: ["id_rol", "nombre_rol", "descripcion"],
        },
      ],
    });
  }

  async findById(id) {
    return Users.findByPk(id, {
      include: [
        {
          model: Role,
          as: "rol",
          attributes: ["id_rol", "nombre_rol", "descripcion"],
        },
      ],
      attributes: { exclude: ["contrasena"] },
    });
  }

  async findByIdWithPassword(id) {
    return Users.findByPk(id, {
      include: [
        {
          model: Role,
          as: "rol",
          attributes: ["id_rol", "nombre_rol", "descripcion"],
        },
      ],
    });
  }

  async updateProfile(id, data) {
    const [updated] = await Users.update(data, {
      where: { id_usuario: id },
    });
    return updated > 0;
  }

  async updatePassword(id, hashedPassword) {
    const [updated] = await Users.update(
      { contrasena: hashedPassword },
      { where: { id_usuario: id } }
    );
    return updated > 0;
  }

  async findByIdWithPermissions(id) {
    return Users.findByPk(id, {
      include: [
        {
          model: Role,
          as: "rol",
          attributes: ["id_rol", "nombre_rol", "descripcion"],
          include: [
            {
              model: require("../../models/auth/Permission"),
              as: "permisos",
              through: { attributes: [] },
              include: [
                {
                  model: require("../../models/auth/Privilege"),
                  as: "privilegios",
                  through: { attributes: [] },
                },
              ],
            },
          ],
        },
      ],
      attributes: { exclude: ["contrasena"] },
    });
  }
}

module.exports = new UserRepository();
