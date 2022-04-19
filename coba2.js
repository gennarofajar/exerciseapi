const express = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
// variabel untuk endpoint
const app = express()

customers = [
    {id:1, name:"Steve"},
    {id:2, name:"Jobs"}
]

/*
*   get -> metode endpoint
*   /   -> root
*   pake localhost:3000
*/
app.get('/', (req, res) =>{
    res.send('Hello World :)');
})

/* 
*   localhost:3000/api/customers 
*/
app.get('/api/customers', (req, res) => {
    // res.send('[1, 2, 3]');
    res.send(customers);
})

app.get('/api/customers/:id', (req, res) => {
    /* 
    *   Handle apabila data idnya tidak ada 
    */
    const customer = customers.find(c => c.id == parseInt(req.params.id));
    if(!customer){
        res.status(404).send('The ID was not found')
    }
    res.send(customer)
    // res.send(req.params.id);
})

app.get('/api/customers/:id/:name', (req, res) => {
    res.send(req.params);
})


/*
*   http://localhost:3000/api/customer
*   di body postman ubah ke json dan masukkan
*   { name: "blabla"}
*   sebab di sini idnya otomatis bertambah tapi namanya harus diinputkan
*/
app.post('/api/customers', (req, res) => {
    /* body itu ada di postman */
    /* mengambil request (input) yg nama */
    if(!req.body.name || req.body.name.length < 3){
        res.status(400).send('Input the valid name');
    }

    const customer = {
        id: customers.length + 1,

        /* ambil namanya */
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



/* 
*   === JWT === 
*/
app.get('/api/login', (req, res) => {
    /* 
    *   Buat di body seperti json
    */
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
    /* 
    *   Buat di authorization
    */
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
