
const { v4: uuidv4 } = require("uuid");
const { MercadoPagoConfig, Payment } = require("mercadopago");
var express = require("express");
var router = express.Router();

const client = new MercadoPagoConfig({
  accessToken:
    "APP_USR-8342706631328434-111919-85fc948955bafa1722a8cbe5d56dc67c-232378121",
  options: { timeout: 5000 },
});

const payment = new Payment(client);

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/criar-pix", function (req, res, next) {
  console.log("Request");
  console.log(req.body);

  const body = {
    transaction_amount: req.body.transaction_amount,
    description: req.body.description,
    payment_method_id: req.body.payment_method_id,
    payer: {
      email: req.body.email,
      identification: {
        type: req.body.identificationType,
        number: req.body.number,
      },
    },
  };

  // Generate a unique idempotency key using uuidv4
  const requestOptions = { idempotencyKey: uuidv4() };

  payment
    .create({ body, requestOptions })
    .then((result) => {
      console.log("Result");
      console.log(result);
      res.json(result); // Send the result to the client
    })
    .catch((error) => {
      console.log("ERROR");
      console.log(error);
      res.status(error.status || 500).json(error); // Send the error to the client
    });
});

module.exports = router;
