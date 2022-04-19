const express = require('express');
const app = express()
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

customers = [
    {id:1, name:"Firdho"},
    {id:2, name:"Genframen"},
    {id:3, name:"Fernando"}
]

app.get('/', (req, res) =>{
    res.send('Hello World :)');
})

app.get('/api/customers', (req, res) => {
    // res.send('[1, 2, 3]');
    res.send(customers);
})

app.get('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id == parseInt(req.params.id));
    if(!customer){
        res.status(404).send('The ID was not found')
    }
    res.send(customer)
})

app.post('/api/customers', (req, res) => {
    if(!req.body.name || req.body.name.length < 3){
        res.status(400).send('Input the valid name');
    }

    const customer = {
        id: customers.length + 1,
        name: req.body.name
    };
    customers.push(customer);
    res.send(customer);
})


app.put('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id == parseInt(req.params.id));
    if(!customer){
        res.status(404).send('The ID was not found');
        return;
    }

    if(!req.body.name || req.body.name.length < 3){
        res.status(400).send('Input the valid name');
        return;
    }

    customer.name = req.body.name;
    res.send(customer);
})

app.delete('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id == parseInt(req.params.id));
    if(!customer){
        res.status(404).send('The ID was not found');
        return;
    }

    const index = customers.indexOf(customer)
    customers.splice(index, 1);

    res.send(customer);
})


app.listen(3000, () => console.log('Listening to port 3000'))

app.get('/api/login', (req, res) => {
    const customer = {
        username: req.body.username,
        password: req.body.password
    }

    jwt.sign({user: customer}, "secret", (err, token) => {
        res.json({
            username: customer.username,
            token: token
        });
    }); 
});

function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization']

    if(typeof bearerHeader != 'undifined'){
        const bearerToken = bearerHeader.split(' ')[1]
        req.token = bearerToken
        next()
    }
    else{
        res.status(403).send("Forbidden")
    }
}

app.post('/api/customers', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secret', (err, authData) => {
        if(err){
            res.status(403).send("Forbidden")
        }
        else{
            authData = customers
            res.send(authData)
        }
    });
});

// heroku
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.warn(`App listening on ${PORT}`);
});

// jgn lupa npm init untuk buat package.json
