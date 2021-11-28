const itemsRoutes = require('./items');

const constructorMethod = (app) => {
  app.use('/items', itemsRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;