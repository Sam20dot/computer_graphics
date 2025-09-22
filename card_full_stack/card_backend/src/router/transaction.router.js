// src/router/transaction.router.js
import { 
  rechargeUser,
  rechargeUserByMachine,
  makePayment,
  withdrawAmount,
  listAllTransactions,
  listTransactionByUserId,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  makePaymentByMachine

} from "../service/transaction.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

export const transactionRouter = (app) => {

  // -------------------- RECHARGE --------------------
  app.post("/transaction/recharge", authMiddleware, authorizeRoles("RECHARGE"), async (req, res) => {
    try {
      const { userId, adminId, amount } = req.body;
      const result = await rechargeUser(userId, adminId, amount);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Recharge by machine
  app.post("/transaction/recharge_machine", async (req, res) => {
    try {
      const { cardId, amount } = req.body;
      const result = await rechargeUserByMachine(cardId, amount);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------- PAYMENT --------------------
  app.post("/transaction/payment", authMiddleware, authorizeRoles("RECHARGE"), async (req, res) => {
    try {
      const { userId, amount, recipientId } = req.body;
      const result = await makePayment(userId, amount, recipientId);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------- WITHDRAWAL --------------------
  app.post("/transaction/withdraw", authMiddleware, authorizeRoles("RECHARGE"), async (req, res) => {
    try {
      const { userId, amount } = req.body;
      const result = await withdrawAmount(userId, amount);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
app.post("/transaction/machine_payment", async (req, res) => {
    try {
        const { cardId, amount, recipientId=null } = req.body;
        const result = await makePaymentByMachine(cardId, amount, recipientId);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
  // -------------------- LIST TRANSACTIONS --------------------
  app.get("/transaction/all", authMiddleware, authorizeRoles("RECHARGE"), async (req, res) => {
    try {
      const transactions = await listAllTransactions();
      res.json(transactions);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/transaction/user/:userId", authMiddleware, authorizeRoles("RECHARGE"), async (req, res) => {
    try {
      const userId = req.params.userId;
      const transactions = await listTransactionByUserId(userId);
      res.json(transactions);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------- GET SINGLE TRANSACTION --------------------
  app.get("/transaction/:id", authMiddleware, authorizeRoles("RECHARGE"), async (req, res) => {
    try {
      const transactionId = req.params.id;
      const transaction = await getTransaction(transactionId);
      res.json(transaction);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // -------------------- UPDATE TRANSACTION --------------------
  app.patch("/transaction/:id", authMiddleware, authorizeRoles("RECHARGE"), async (req, res) => {
    try {
      const transactionId = req.params.id;
      const updateData = req.body;
      const updatedTransaction = await updateTransaction(transactionId, updateData);
      res.json(updatedTransaction);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // -------------------- DELETE TRANSACTION --------------------
  app.delete("/transaction/:id", authMiddleware, authorizeRoles("RECHARGE"), async (req, res) => {
    try {
      const transactionId = req.params.id;
      const deleted = await deleteTransaction(transactionId);
      res.json({ message: "Transaction deleted successfully", deleted });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

};
