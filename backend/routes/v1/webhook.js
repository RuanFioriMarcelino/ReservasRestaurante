var express = require("express");
var router = express.Router();

const paymentDetails = await payment.get(paymentId);

console.log(paymentDetails)

router.post('/v1/webhook', async (req, res) => {
    try {
      console.log('Recebendo notificação do Mercado Pago');
      const { query, body } = req;
  
      // Captura o ID do pagamento
      const paymentId = query['data.id'] || body.data?.id;
      if (!paymentId) {
        console.error('ID do pagamento não encontrado na notificação.');
        return res.status(400).send('ID do pagamento ausente.');
      }
  
      console.log(`Notificação recebida para o pagamento: ${paymentId}`);
  
      // Obtenha os detalhes do pagamento
      const paymentDetails = await payment.get(paymentId);
  
      if (paymentDetails && paymentDetails.body) {
        const status = paymentDetails.body.status;
        console.log(`Status do pagamento: ${status}`);
  
        // Aqui, você deve processar o status do pagamento (ex.: atualizar o banco de dados)
        return res.status(200).send('Notificação processada com sucesso.');
      } else {
        console.error('Detalhes do pagamento não encontrados ou inválidos.');
        return res.status(404).send('Detalhes do pagamento não encontrados.');
      }
    } catch (error) {
      console.error('Erro ao processar o webhook:', error.message);
      res.status(500).send('Erro interno ao processar notificação.');
    }
  });
  
  
module.exports = router;