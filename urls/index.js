const path = require('path');

const hub = (app) => {
    
    // console.log(app);
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'))
    });

    app.get('/rest_help', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/rest_help.html'))
    });
        
    
}

module.exports = {
    hub
}