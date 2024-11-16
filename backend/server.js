import { MercadoPagoConfig, Payment } from 'mercadopago';
import 'dotenv/config'

const client = new MercadoPagoConfig({ accessToken: process.env.accessToken, options: { timeout: 5000 } });

const body = {
    transaction_amount: 20.00,
    description: 'Teste API',
    payment_method_id: 'pix',
    payer: {
        email: 'ruanfiorimarcelino@gmail.com'
    },
};


const payment = new Payment(client);



payment.create({ body }).then(console.log).catch(console.log);