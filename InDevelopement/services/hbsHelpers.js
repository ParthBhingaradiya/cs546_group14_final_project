const Handlebars = require('handlebars')

Handlebars.registerHelper('base_url', function (block) {
    return "http://localhost:3001";
});

Handlebars.registerHelper('iftrue', function (params) {
    if (params[0]) {
        return params.length === 2 ? params[0] : params[1];
    }
    if (params.length === 2) {
        return params[1];
    } else if (params.length === 3) {
        return params[2];
    }
    return null;
})

Handlebars.registerHelper('ifMatch', function (variable1, variable2, options) {
    if (variable1 === variable2) {
        return options.fn(this);
    }
    return options.inverse(this);
});