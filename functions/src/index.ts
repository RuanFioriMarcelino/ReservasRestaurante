const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Função para listar usuários
exports.listUsers = functions.https.onRequest(async (req: any, res: any) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users.map((user:any) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    }));
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).send("Erro ao listar usuários");
  }
});
