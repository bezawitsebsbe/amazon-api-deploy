

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file
const stripe = require('stripe')(process.env.STRIPE_KEY); // Use STRIPE_KEY from .env
const app =express();
 
// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Home route
app.get('/', (request, response) => response.status(200).send('hello world!'));
app.get('/evangadi', (request, response) => response.status(200).send('evangadi'));

app.post('/payments/create', async (request, response) => {
    const total = request.query.total; // Get total from query
    console.log('Payment request received for this amount >>>', total);

    // Validate the total amount
    if (!total || isNaN(total)) {
        return response.status(400).send({ error: 'Invalid total amount' });
    }

    try {
        console.log('Creating payment intent with amount:', total);
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: 'usd',
        });

        const clientSecret = paymentIntent.client_secret;
        console.log('Client Secret:', clientSecret);

        response.status(201).send({
            clientSecret: clientSecret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error); // Log error details
        response.status(500).send({
            error: 'Payment failed: ' + error.message,
        });
    }
});
// Start the server
app.listen(5000, (err) => {
    if (err) throw err;
    console.log("Server running on port: 5000, http://localhost:5000");
});







