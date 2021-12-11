const authMiddleware = (app) => {
    app.use('/item', (req, res, next) => {
        if (!req.session.userauth) {
            return res.redirect('/login');
        } else {
            next();
        }
    });
    app.use('/profile', (req, res, next) => {
        if (!req.session.userauth) {
            return res.redirect('/login');
        } else {
            next();
        }
    });
    app.use('/login', (req, res, next) => {
        if (req.session.userauth) {
            return res.redirect('/');
        } else {
            next();
        }
    });
};

module.exports = authMiddleware;