/*
 * HOW TO WRITE MODELS:
 * Define your models by requiring sequelize-connection at runtime and using connection.define()
 * The ModelName variable must be PascalCase and the filename is the exact same except lowercase and split up with '-' => model-name (required for model loader)
 * The table names are plural and with underscores => model_names
 * Do NOT require other models inside a model, use the defineModels(models) function and assign it to a global variable inside the scripts
 * Do NOT specify associations at runtime, place them inside the function defineModels(models) and export this function
 */

const sequelize = require('./sequelize-connection').connection;
const models = {};
const modules = [];

sequelize.options.define.freezeTableName = true;
sequelize.options.define.underscored = true;
sequelize.options.define.underscoredAll = true;

require('fs').readdirSync(__dirname).forEach(function(file) {
    if (file === 'index.js') return;
    if (file.split('.').length !== 2) return;
    const mod = require('./' + file);
    let modelName = file.split('.')[0];
    modelName = modelName.split('-').map(n => n.charAt(0).toUpperCase() + n.substring(1)).join('');
    models[modelName] = mod;
    modules.push(mod);
});
modules.forEach(mod => { if (mod.defineModels) mod.defineModels(models); });

sequelize.sync();

module.exports = {};