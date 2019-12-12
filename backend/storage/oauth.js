const Sequelize = require("sequelize");

module.exports = class {
  constructor(sequelize) {
    this.Model = this.Model = sequelize.define("oauth", {
      // oauth
      userId: { type: Sequelize.STRING, primaryKey: true },
      tenantId: Sequelize.TEXT,
      provider: Sequelize.STRING,
      accessToken: Sequelize.TEXT,
      refreshToken: Sequelize.TEXT,
    });
  }

  async saveTokens({ userId, tenantId, accessToken, refreshToken, provider }) {
    const fieldsToUpdate = refreshToken ? ["accessToken", "refreshToken", "provider"] : ["accessToken", "provider"];
    await this.Model.upsert({ userId, tenantId, accessToken, refreshToken, provider }, { fields: fieldsToUpdate });
  }

  async getByUserId(userId) {
    return await this.Model.findByPk(userId);
  }
};
