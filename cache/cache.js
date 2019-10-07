const { URL_MONGO } = require('../config');

const MongoClient = require('mongodb').MongoClient;

const uri = URL_MONGO;

const client = new MongoClient(uri, { useNewUrlParser: true });

const saveData = (data) => {

    return new Promise((resolve, reject) => {

        client.connect((err, db) => {

            if (err) throw err;
    
            const dbo = db.db("test");
    
            dbo.collection("cache").insertOne(data, (err, res) => {
    
                if (err) throw err;
    
                console.log("nuevo registro!");
                resolve(true);
    
                db.close();
    
            })
        
        });

    })

}

const selectData = (data) => {

    return new Promise((resolve, reject) => {

        client.connect((err, db) => {

            if (err) throw err;
    
            const dbo = db.db("test");

            dbo.collection("cache").findOne(data, {
                sort:{ timestamp : -1 }
            },(err, res) => {
    
                if (err) throw err;
    
                resolve(res);
    
            })
        
        });

    })

}

const resturnTiempoX = () => {

    return new Promise((resolve, reject) => {

        client.connect((err, db) => {

            if (err) throw err;
    
            const dbo = db.db("test");

            dbo.collection("config").findOne({},(err, res) => {
    
                if (err) throw err;
    
                resolve(res);
    
            })
        
        });

    })

}

const updateTiempoX = (data) => {

    return new Promise((resolve, reject) => {

        client.connect((err, db) => {

            if (err) throw err;
    
            const dbo = db.db("test");

            var myquery = { name: "tiempox" };
            var newvalues = { $set: {tiempox: data } };
    
            dbo.collection("config").updateOne(myquery, newvalues, (err, res) => {
    
                if (err) throw err;
                          
                console.log("update registro!");
                resolve(true);
    
                db.close();
    
            })
        
        });

    })

}

const saveUsers = (data) => {

    return new Promise((resolve, reject) => {

        client.connect((err, db) => {

            if (err) throw err;
    
            const dbo = db.db("test");
    
            dbo.collection("users").insertOne(data, (err, res) => {
    
                if (err) throw err;
    
                console.log("nuevo registro!");
                resolve(true);
    
                db.close();
    
            })
        
        });

    })

}

const selectUsers = (data) => {

    return new Promise((resolve, reject) => {

        client.connect((err, db) => {

            if (err) throw err;
    
            const dbo = db.db("test");

            if(data){
                dbo.collection("users").findOne(data, (err, res) => {
    
                    if (err) throw err;
        
                    resolve(res);
        
                })
            }else{
                dbo.collection("users").find({}).toArray((err, res) => {
    
                    if (err) throw err;
        
                    resolve(res);
        
                });
            }
        
        });

    })

}

const saveHistory = (data) => {

    return new Promise((resolve, reject) => {

        client.connect((err, db) => {

            if (err) throw err;
    
            const dbo = db.db("test");
    
            dbo.collection("history").insertOne(data, (err, res) => {
    
                if (err) throw err;
    
                console.log("nuevo registro!");
                resolve(true);
    
                db.close();
    
            })
        
        });

    })

}

const selectHistory = (data) => {

    return new Promise((resolve, reject) => {

        client.connect((err, db) => {

            if (err) throw err;
    
            const dbo = db.db("test");

            dbo.collection("history").find({}).toArray((err, res) => {
    
                if (err) throw err;
    
                resolve(res);
    
            });
        
        });

    })

}

module.exports = {
    selectData,
    saveData,
    resturnTiempoX,
    updateTiempoX,
    saveUsers,
    selectUsers,
    saveHistory,
    selectHistory
}