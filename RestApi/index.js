const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express(); 

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "calendario"
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, x-auth");
    next();
  });

app.use(bodyParser.json());


conn.connect(function(erro){
    if(!!erro){
        console.log("erro: " + erro);
    }else{
        console.log("conectado.");
    }
});


app.post('/login/', (req, res) => {
    let query = `SELECT * FROM user WHERE email = '${req.body.email}' and password = '${req.body.password}'`;
    conn.query(query, function(erro, rows, fields){
        if(!!erro){
            console.log("erro: " + erro);
        }else{
            if(Object.keys(rows).length == 0){
                res.send("{\"loginAuth\": 0}");
            }
            else{
                rows[0].loginAuth = "1";
                res.status(200).send(JSON.stringify(rows[0]));
            }
        }
    })
});


app.get('/userByName/:name', (req, res) => {
    conn.query(query, function(erro, rows, fields){
        if(!!erro){
            console.log("erro: " + erro);
        }else{
            res.send("{length: "+ rows.length+", users: {"+JSON.stringify(rows)+"}");
        }
    })
});
app.get('/userByEmail/:email', (req, res) => {
    let query = `SELECT * FROM user WHERE (email = '${req.params.email}')`;
    conn.query(query, function(erro, rows, fields){
        if(!!erro){
            console.log("erro: " + erro);
        }else{
            res.send("{length: "+ rows.length+", users: "+JSON.stringify(rows)+"");
        }
    })
});

app.post('/createUser/', (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    let queryCheckName =  `SELECT * FROM user WHERE (name = '${user.name}')`;
    let queryCheckEmail =  `SELECT * FROM user WHERE (email = '${user.email}')`;
    let query = `INSERT INTO user(name, email, password) values('${user.name}', '${user.email}','${user.password}')`;
    conn.query(queryCheckName, function(erro, rows_name, fields){
        if(!rows_name.length){
            conn.query(queryCheckEmail, function(erro, rows_email, fields){
                    if(!rows_email.length){
                        conn.query(query, function(erro, row, fields){
                                res.status(200).send("{\"userError\": 0, \"user\":"+JSON.stringify(user)+"}");
                        });
                    }else{
                        res.status(200).send("{\"userError\": 2}");
                    }
            });
        }
        else{
            console.log("erro 1");
            res.status(200).send("{\"userError\": 1}");
        }
    })
});

app.post('/createEvent/', (req, res) => {
    const event = {
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        creatorID: req.body.creatorID
    }
    let queryCheckOverlap = 
         `SELECT * FROM event WHERE
          (creatorID = ${event.creatorID} AND 
            (
                ((start >= ${event.startDate}) AND (start <= ${event.endDate})) 
                OR
                ((end >= ${event.startDate}) AND (end <= ${event.endDate}))
            )
          )`;
    let query = `INSERT INTO event(name, description, start, end, creatorID) values('${event.name}', '${event.description}',
    '${event.startDate}','${event.endDate}', '${event.creatorID}')`;

    conn.query(queryCheckOverlap, function(erro, rows_check, fields){
        if(!rows_check.length){
            conn.query(query, function(erro, rows, fields){
                if(erro){
                    res.send({eventError: -1});
                }else{
                    console.log("Event" + JSON.stringify(event));
                    res.send({eventError: 0});
                }
            });
        }
        else{
            console.log("overlap");
            res.status(200).send({eventError: 1});
        }
    });
});

app.get('/eventInterval/:creatorID/:start/:end', (req, res) => {
    let query = `SELECT * FROM event WHERE
                    creatorID = ${req.params.creatorID} AND (
                    ((start >= ${req.params.start}) AND (start <= ${req.params.end})) 
                    OR
                    ((end >= ${req.params.start}) AND (end <= ${req.params.end}))
                    )
                    ORDER BY start
                    `;
    conn.query(query, function(erro, rows, fields){
        if(!!erro){
            console.log("erro: " + erro);
        }else{
            res.send(rows);
        }
    })
});

app.put('/updateEvent', (req, res) => {
    const event = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        start: req.body.startDate,
        end: req.body.endDate,
        creatorID: req.body.creatorID
    }
    let query = `UPDATE event SET name='${event.name}', description='${event.description}',
            start='${event.start}', end='${event.end}' WHERE id=${event.id} AND creatorID=${event.creatorID}`;
    conn.query(query, function(erro, rows, fields){ 
        if(!!erro){
            console.log("erro: " + erro);
        }else{
            res.send("Evento Editado: " + JSON.stringify(event));
        }
    })
});


app.delete('/deleteEvent/:id', (req, res) => {
    let query = `DELETE FROM event WHERE id = ${req.params.id}`
    conn.query(query, function(erro, rows, fields){
        if(!!erro){
            console.log("erro: " + erro);
        }else{
            res.send({delete:1});
        }
    })
});


app.listen(3000);

