import api from "./api";

export async function getAccounts() {
  const res = await api.get("/accounts");
  return res.data;
}

export async function createAccount() {
  const res = await api.post("/accounts/create");
  return res.data;
}

export async function getAccountBalance(accountId) {
  const res = await api.get(`/accounts/${accountId}/balance`);
  return res.data;
}
