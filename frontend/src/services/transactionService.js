import api from "./api";

export async function createTransaction({ fromAccount, toAccount, amount, idempotencyKey }) {
  const res = await api.post("/transactions", {
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
  });
  return res.data;
}

export async function getTransactions() {
  const res = await api.get("/transactions");
  return res.data;
}
export async function createInitialFunds({ toAccount, amount, idempotencyKey }) {
  const res = await api.post("/transactions/system/initial-funds", {
    toAccount,
    amount,
    idempotencyKey,
  });
  return res.data;
}
