const itemsRoutes = require('./items');
const productRoute = require('./product')
const addProductRoute = require('./addproduct')

const constructorMethod = (app) => {
    app.use('/item', itemsRoutes);
    app.use('/', productRoute);
    // app.use('/additem', addProductRoute);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;