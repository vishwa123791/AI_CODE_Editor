const app = require('./app');
const sequelize = require('./config/db');

const PORT = process.env.PORT || 8080;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('MySQL connection established');

    await sequelize.sync();
    console.log('Models synced');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();