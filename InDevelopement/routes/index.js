const itemsRoutes = require('./items');
const productRoute = require('./product')
const constructorMethod = (app) => {
    app.use('/item', productRoute);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;