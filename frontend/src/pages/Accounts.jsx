import { useEffect, useState, useCallback } from "react";
import { Plus, Wallet, RefreshCw, Copy, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import * as accountService from "../services/accountService";
import StatusBadge from "../components/StatusBadge";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import { formatCurrency } from "../utils/formatCurrency";

export default function Accounts() {
  const { user } = useAuth();
const [copiedValue, setCopiedValue] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await accountService.getAccounts();
      const list = data.accounts || [];

      setAccounts(list);

      const balanceResults = await Promise.allSettled(
        list.map((acc) =>
          accountService.getAccountBalance(acc._id)
        )
      );

      const next = {};

      balanceResults.forEach((result, index) => {
        if (result.status === "fulfilled") {
          next[list[index]._id] = result.value.balance;
        }
      });

      setBalances(next);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to load your accounts."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);
const handleCopy = async (value) => {
  try {
    await navigator.clipboard.writeText(String(value));

    setCopiedValue(value);

    setTimeout(() => {
      setCopiedValue(null);
    }, 1500);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};
  const handleCreate = async () => {
    setCreating(true);
    setError("");
    setSuccess("");

    try {
      await accountService.createAccount();
      setSuccess("Account created successfully.");
      await loadAccounts();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to create account."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="page">

      <div className="page__header page__header--row">
        <div>
          <h1>My Accounts</h1>
          <p>
            Manage all your bank accounts in one place.
          </p>
        </div>

        <div className="page__header-actions">

          <button
            className="btn btn--ghost"
            onClick={loadAccounts}
            disabled={loading || creating}
          >
            <RefreshCw
              size={18}
              className={loading ? "spin" : ""}
            />
            Refresh
          </button>

          <button
            className="btn btn--primary"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? (
              <Loading
                message="Creating account..."
                size={18}
              />
            ) : (
              <>
                <Plus size={18} />
                Create New Account
              </>
            )}
          </button>

        </div>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={() => setError("")}
        />
      )}

      {success && (
        <div
          className="success-message"
          onClick={() => setSuccess("")}
        >
          {success}
        </div>
      )}

      {loading ? (
        <Loading message="Loading accounts..." />
      ) : accounts.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No accounts found"
          description="You don't have any accounts yet. Create one to get started."
          action={
            <button
              className="btn btn--primary"
              onClick={handleCreate}
              disabled={creating}
            >
              <Plus size={18} />
              Create New Account
            </button>
          }
        />
      ) : (
        <div className="table-wrap">

          <table className="data-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Account ID</th>
                <th>Account Number</th>
                <th>Currency</th>
                <th>Status</th>
                <th>Balance</th>
                <th>Created</th>
              </tr>
            </thead>

          <tbody>
  {accounts.map((acc) => (
    <tr key={acc._id}>

      {/* NAME */}
      <td>
        <strong>
          {user?.username || user?.name || "—"}
        </strong>
      </td>

      {/* ACCOUNT ID */}
      <td className="mono">
        <div className="account-id-cell">
          <span>{acc._id}</span>

          <button
            type="button"
            className="copy-button"
            onClick={() => handleCopy(acc._id)}
            title="Copy Account ID"
          >
            {copiedValue === acc._id ? (
              <Check size={16} />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </td>

      {/* ACCOUNT NUMBER */}
      <td className="mono">
        <div className="account-id-cell">
          <span>{acc.accountNumber}</span>

          <button
            type="button"
            className="copy-button"
            onClick={() => handleCopy(acc.accountNumber)}
            title="Copy Account Number"
          >
            {copiedValue === acc.accountNumber ? (
              <Check size={16} />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </td>

      {/* CURRENCY */}
      <td>
        {acc.currency || "INR"}
      </td>

      {/* STATUS */}
      <td>
        <StatusBadge status={acc.status} />
      </td>

      {/* BALANCE */}
     <td className="balance-cell">
  {user?.systemUser ? (
    "-"
  ) : typeof balances[acc._id] !== "number" ? (
    <span className="skeleton skeleton--text" />
  ) : (
    formatCurrency(
      balances[acc._id],
      acc.currency
    )
  )}
</td>
      {/* CREATED */}
      <td>
        {acc.createdAt
          ? new Date(
              acc.createdAt
            ).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )
          : "—"}
      </td>

    </tr>
  ))}
</tbody>

          </table>

        </div>
      )}

    </div>
  );
}