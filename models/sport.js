/* eslint-disable quotes */
'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Sport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Sport.belongsTo(models.Player, {
        foreignKey: "userId"
      })
      // define association here
    }

    // static createsport ({ name }) {
    //   console.log(this.name, '\n')
    //   const [sport, created] = this.findOrCreate({ where: { name: this.name } })
    //   return created
    // }
    static async createsport ({ sname, userId }) {
      try {
        console.log(sname)
        const [sport, created] = await this.findOrCreate({
          where: { name: sname },
          defaults: {
            userId
          }
        })
        return created
      } catch (err) {
        console.log(err)
        return null
      }
    }
  }
  Sport.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sport'
  })
  return Sport
}
