const express = require('express');
const Joi = require('joi');
const app = new express();

app.use(express.json());



const customers = [
    {id: 1, fName: 'John' , lName: 'Doe', email: 'Example@noEmail.com'}
];


app.get('/api', (req, res) => {
    res.send('Hello')
});

app.get('/api/customers', (req, res) => {
    res.send(customers);
});

app.post('/api/customers', (req, res) => {
    
    const {error} = validateCustomer(req.body);

    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }
   
    const customer = {
        id: customers.length + 1,
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email
    };
    
   
    customers.push(customer);
    res.send(customer);

});

app.put('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if(!customer) return res.status(404).send('Invalid customer ID');

    const result = validateCustomer(req.body);
    const {error} = validateCustomer(req.body);

    if(error) {
        res.status(400).send(result.error.details[0]);
    }

    customer.fName = req.body.fName;
    customer.lName = req.body.lName;
    customer.email = req.body.email;
    res.send(customer);
})

app.delete('/api/customers/:id', (req,res) => {
    //Look up by customer ID, if non-exising, return 404
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if(!customer) return res.status(404).send('Invalid customer ID');

    //Find index of customer
    const index = customers.indexOf(customer)
    //Go to index, remove one customer
    customers.splice(index, 1)
    //Return the same customer
    res.send(customer)
})


function validateCustomer(customer) {
    const schema = Joi.object ({
        fName: Joi.string()
        .min(3)
        .max(30)
        .required(),
        
        lName: Joi.string()
        .min(3)
        .required(30),

        email: Joi.string()
        .email()
        .required()
        
    });
    
    return schema.validate(customer);
}

//Env port or port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Active on port ${port}`));
