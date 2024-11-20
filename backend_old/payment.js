const { MercadoPagoConfig, Payment } = require("mercadopago");
require("dotenv/config");

// Configuração do cliente Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.accessToken,
  options: { timeout: 5000 },
});

// Criação da instância de pagamento
const payment = new Payment(client);

// Função para criar um pagamento
function createPixPayment(transactionAmount, description, payerEmail) {
  const body = {
    transaction_amount: transactionAmount,
    description: description,
    payment_method_id: "pix",
    payer: {
      email: payerEmail,
    },
  };

  return payment
    .create({ body })
    .then((response) => {
      console.log("Payment created:", response);

      if (response.body && response.body.point_of_interaction) {
        const pointOfInteraction = response.body.point_of_interaction;
        if (pointOfInteraction.transaction_data) {
          const qrCode = pointOfInteraction.transaction_data.qr_code;
          const qrCodeBase64 =
            pointOfInteraction.transaction_data.qr_code_base64;

          return { qrCode, qrCodeBase64 };
        } else {
          throw new Error("Transaction data not available.");
        }
      } else {
        throw new Error("Point of interaction not available.");
      }
    })
    .catch((error) => {
      console.error("Error creating payment:", error);
      throw error;
    });
}

// Exporte a função
module.exports = { createPixPayment };
