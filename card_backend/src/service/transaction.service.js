// services/transaction.service.js
import { LogsMonitor } from "../model/logsMonitor.model.js";
import { Transaction } from "../model/transaction.model.js";
import { Users } from "../model/users.model.js";
import { Admins } from "../model/admins.model.js";

// -------------------- RECHARGE --------------------
export async function rechargeUser(userId, adminId, amount) {
    const admin = await Admins.findById(adminId);
    const user = await Users.findById(userId);

    if (!admin) throw new Error("Admin does not exist");
    if (!user) throw new Error("User does not exist");

    const updatedUser = await Users.findByIdAndUpdate(
        userId,
        { $inc: { balance: amount } },
        { new: true }
    );

    const transaction = new Transaction({
        userId,
        adminId,
        amount,
        nature: "RECHARGE",
        status1: "SUCCESS"
    });
    await transaction.save();

    const log = new LogsMonitor({
        action: "RECHARGE",
        userId,
        adminId,
        source: "WEB"
    });
    await log.save();

    return {
        user: updatedUser._id,
        admin: admin._id,
        amount: transaction.amount,
        balance: updatedUser.balance
    };
}

export async function rechargeUserByMachine(cardId, amount) {
    const user = await Users.findOne({ cardId });
    if (!user) throw new Error("Card not found");

    const updatedUser = await Users.findByIdAndUpdate(
        user._id,
        { $inc: { balance: amount } },
        { new: true }
    );

    const transaction = new Transaction({
        userId: user._id,
        amount,
        nature: "RECHARGE",
        source: "MACHINE",
        status1: "SUCCESS"
    });
    await transaction.save();

    const log = new LogsMonitor({
        action: "RECHARGE",
        userId: user._id,
        source: "MACHINE"
    });
    await log.save();

    return {
        user: updatedUser._id,
        amount: transaction.amount,
        balance: updatedUser.balance
    };
}

// -------------------- PAYMENT --------------------
export async function makePayment(userId, amount, recipientId = null) {
    const user = await Users.findById(userId);
    if (!user) throw new Error("User not found");
    if (user.balance < amount) throw new Error("Insufficient balance");

    const updatedUser = await Users.findByIdAndUpdate(
        userId,
        { $inc: { balance: -amount } },
        { new: true }
    );

    let updatedRecipient = null;
    if (recipientId) {
        updatedRecipient = await Users.findByIdAndUpdate(
            recipientId,
            { $inc: { balance: amount } },
            { new: true }
        );
    }

    const transaction = new Transaction({
        userId,
        recipientId,
        amount,
        nature: "PAYMENT",
        status1: "SUCCESS"
    });
    await transaction.save();

    const log = new LogsMonitor({
        action: "PAYMENT",
        userId,
        recipientId,
        source: "WEB"
    });
    await log.save();

    return {
        senderBalance: updatedUser.balance,
        recipientBalance: updatedRecipient?.balance || null,
        transactionId: transaction._id
    };
}
// -------------------- PAYMENT VIA MACHINE --------------------
export async function makePaymentByMachine(cardId, amount, recipientId = null) {
    // 1️⃣ Find the user making the payment using their cardId
    const user = await Users.findOne({ cardId });
    if (!user) throw new Error("Card not found");

    // 2️⃣ Check if the user has enough balance
    if (user.balance < amount) throw new Error("Insufficient balance");

    // 3️⃣ Deduct the amount from the sender
    const updatedUser = await Users.findByIdAndUpdate(
        user._id,
        { $inc: { balance: -amount } },
        { new: true }
    );

    // 4️⃣ Add the amount to the recipient if recipientId is provided
    let updatedRecipient = null;
    if (recipientId) {
        updatedRecipient = await Users.findByIdAndUpdate(
            recipientId,
            { $inc: { balance: amount } },
            { new: true }
        );
    }

    // 5️⃣ Create a transaction record
    const transaction = new Transaction({
        userId: user._id,
        recipientId,
        amount,
        nature: "PAYMENT",
        source: "MACHINE",
        status1: "SUCCESS"
    });
    await transaction.save();

    // 6️⃣ Log the payment
    const log = new LogsMonitor({
        action: "PAYMENT",
        userId: user._id,
        recipientId,
        source: "MACHINE"
    });
    await log.save();

    // 7️⃣ Return the updated balances and transactionId
    return {
        senderBalance: updatedUser.balance,
        recipientBalance: updatedRecipient?.balance || null,
        transactionId: transaction._id
    };
}


// -------------------- WITHDRAWAL --------------------
export async function withdrawAmount(userId, amount) {
    const user = await Users.findById(userId);
    if (!user) throw new Error("User not found");
    if (user.balance < amount) throw new Error("Insufficient balance");

    const updatedUser = await Users.findByIdAndUpdate(
        userId,
        { $inc: { balance: -amount } },
        { new: true }
    );

    const transaction = new Transaction({
        userId,
        amount,
         nature: "WITHDRAWAL",
        status1: "SUCCESS"
    });
    await transaction.save();

    const log = new LogsMonitor({
        action: "WITHDRAWAL",
        userId,
        source: "WEB"
    });
    await log.save();

    return {
        user: updatedUser._id,
        amount,
        balance: updatedUser.balance
    };
}

// -------------------- LIST TRANSACTIONS --------------------
export async function listTransactions(query = {}, options = {}) {
    const { sortBy = "createdAt", sortOrder = -1 } = options;
    return await Transaction.find(query).sort({ [sortBy]: sortOrder });
}
export async function listAllTransactions(options) {
    return await listTransactions({},options)
}
//--------------------list transaction by user =id
export async function listTransactionByUserId(userId,options) {
    return await listTransactions({userId},options)
}
export async function listTransactionsByPayment(nature,options) {
    return listTransactions({nature:"PAYMENT"},options)
}


// -------------------- GET SINGLE TRANSACTION --------------------
export async function getTransaction(transactionId) {
    return await Transaction.findById(transactionId);
}

// -------------------- UPDATE TRANSACTION --------------------
export async function updateTransaction(transactionId, updateData = {}) {
    return await Transaction.findByIdAndUpdate(
        transactionId,
        { $set: updateData },
        { new: true }
    );
}

// -------------------- DELETE TRANSACTION --------------------
export async function deleteTransaction(transactionId) {
    return await Transaction.findByIdAndDelete(transactionId);
}
