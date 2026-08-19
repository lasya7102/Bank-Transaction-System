import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { ArrowLeftRight, Send } from "lucide-react";
import * as transactionService from "../services/transactionService";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import TransactionResult from "../components/TransactionResult";

export default function Transfer() {
  const { user } = useAuth();

  /*
   * Detect SYSTEM USER safely.
   */
  const isSystemUser =
    user?.systemUser === true ||
    user?.isSystemUser === true ||
    String(user?.role || "").toLowerCase() === "system" ||
    String(user?.role || "").toLowerCase() === "systemuser" ||
    String(user?.role || "").toLowerCase() === "system_user";

  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [error, setError] = useState("");

  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  /*
   * No accounts need to be loaded anymore.
   * From Account and To Account are entered manually.
   */
  useEffect(() => {
    setLoadingAccounts(false);
  }, []);

  const resetForm = () => {
    setFromAccount("");
    setToAccount("");
    setAmount("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    const numericAmount = parseFloat(amount);

    /*
     * NORMAL USER
     * Must enter From Account.
     */
    if (!isSystemUser && !fromAccount.trim()) {
      setError("Please enter the source account ID.");
      return;
    }

    /*
     * BOTH USERS
     * Must enter To Account.
     */
    if (!toAccount.trim()) {
      setError("Please enter the destination account ID.");
      return;
    }

    /*
     * NORMAL USER
     * Cannot transfer to the same account.
     */
    if (
      !isSystemUser &&
      fromAccount.trim() === toAccount.trim()
    ) {
      setError(
        "You cannot transfer money to the same account."
      );
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    setSubmitting(true);

    try {
      const idempotencyKey =
        generateIdempotencyKey();

      let data;

      /*
       * SYSTEM USER
       *
       * Creates INITIAL FUNDS transaction.
       *
       * No fromAccount is sent.
       */
     if (user?.systemUser === true) {
  data = await transactionService.createInitialFunds({
    toAccount: toAccount.trim(),
    amount: numericAmount,
    idempotencyKey,
  });
} else {
  data = await transactionService.createTransaction({
    fromAccount: fromAccount.trim(),
    toAccount: toAccount.trim(),
    amount: numericAmount,
    idempotencyKey,
  });
}
      if (data.transaction) {
        setResult(data.transaction);

        resetForm();
      } else {
        setError(
          data.message ||
            "Transaction could not be completed. Please check your transactions and try again."
        );
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Transfer failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">

      <div className="page__header">
        <h1>Transfer Money</h1>

        <p>
          {isSystemUser
            ? "Add initial funds to a user account."
            : "Send money securely between accounts."}
        </p>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={() => setError("")}
        />
      )}

      {result && (
        <TransactionResult
          transaction={result}
        />
      )}

      {loadingAccounts ? (
        <Loading message="Loading accounts..." />
      ) : (
        <div className="card transfer-card">

          <form
            onSubmit={handleSubmit}
            className="form"
          >

            {/* 
             * FROM ACCOUNT
             *
             * NORMAL USER ONLY
             *
             * NOW MANUAL INPUT
             */}
            {!isSystemUser && (
              <div className="form-field">

                <label htmlFor="fromAccount">
                  From Account
                </label>

                <input
                  id="fromAccount"
                  type="text"
                  placeholder="Enter source account ID"
                  value={fromAccount}
                  onChange={(e) =>
                    setFromAccount(e.target.value)
                  }
                  disabled={submitting}
                />

              </div>
            )}

            {/* 
             * TO ACCOUNT
             *
             * BOTH NORMAL AND SYSTEM USER
             *
             * MANUAL INPUT
             */}
            <div className="form-field">

              <label htmlFor="toAccount">
                To Account
              </label>

              <input
                id="toAccount"
                type="text"
                placeholder={
                  isSystemUser
                    ? "Enter user account ID"
                    : "Enter destination account ID"
                }
                value={toAccount}
                onChange={(e) =>
                  setToAccount(e.target.value)
                }
                disabled={submitting}
              />

            </div>

            {/* AMOUNT */}

            <div className="form-field">

              <label htmlFor="amount">
                Amount (INR)
              </label>

              <input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                disabled={submitting}
              />

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="btn btn--primary btn--block"
              disabled={submitting}
            >

              {submitting ? (
                <Loading
                  message={
                    isSystemUser
                      ? "Adding funds..."
                      : "Processing transfer..."
                  }
                  size={18}
                />
              ) : (
                <>
                  <Send size={18} />

                  {isSystemUser
                    ? "Add Initial Funds"
                    : "Transfer Money"}
                </>
              )}

            </button>

          </form>

          {submitting && (
            <div className="transfer-notice">

              <ArrowLeftRight
                size={16}
                className="spin"
              />

              <span>
                {isSystemUser
                  ? "Initial funds transaction is being processed. This may take up to 15 seconds — please keep this page open."
                  : "Your transfer is being processed. This may take up to 15 seconds — please keep this page open."}
              </span>

            </div>
          )}

        </div>
      )}

    </div>
  );
}