import { useEffect, useState } from "react";
import { Receipt, Search, Filter } from "lucide-react";
import * as transactionService from "../services/transactionService";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { formatCurrency } from "../utils/formatCurrency";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await transactionService.getTransactions();

      setTransactions(data.transactions || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to load transaction history."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Check whether an account belongs
   * to the SYSTEM USER.
   */
  const isSystemUser = (user) => {
    if (!user) {
      return false;
    }

    return (
      user.systemUser === true ||
      user.isSystemUser === true ||
      String(user.role || "").toLowerCase() === "system" ||
      String(user.role || "").toLowerCase() === "systemuser" ||
      String(user.role || "").toLowerCase() === "system_user"
    );
  };

  /*
   * Get user name safely.
   */
  const getUserName = (account) => {
    if (!account?.user) {
      return "Unknown";
    }

    /*
     * SYSTEM USER
     */
    if (isSystemUser(account.user)) {
      return account.user.username || "SYSTEM";
    }

    return (
      account.user.username ||
      account.user.name ||
      "Unknown"
    );
  };

  /*
   * Get masked account number.
   *
   * SYSTEM account numbers are not displayed.
   */
  const getAccountNumber = (account) => {
    if (!account?.user) {
      return "Unknown";
    }

    if (isSystemUser(account.user)) {
      return "";
    }

    if (!account.accountNumber) {
      return "Unknown";
    }

    const number = String(account.accountNumber);

    return `••••${number.slice(-4)}`;
  };

  /*
   * Search + status filtering
   */
  const filteredTransactions = transactions.filter(
    (transaction) => {
      const searchText = search.toLowerCase();

      const fromAccountNumber =
        transaction.fromAccount?.accountNumber
          ?.toLowerCase?.() || "";

      const toAccountNumber =
        transaction.toAccount?.accountNumber
          ?.toLowerCase?.() || "";

      const fromName = getUserName(
        transaction.fromAccount
      ).toLowerCase();

      const toName = getUserName(
        transaction.toAccount
      ).toLowerCase();

      const transactionId =
        transaction._id?.toLowerCase() || "";

      const matchesSearch =
        transactionId.includes(searchText) ||
        fromAccountNumber.includes(searchText) ||
        toAccountNumber.includes(searchText) ||
        fromName.includes(searchText) ||
        toName.includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        transaction.status?.toLowerCase() ===
          statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  return (
    <div className="page">

      {/* =========================================
          PAGE HEADER
          ========================================= */}

      <div className="page__header">
        <h1>Transaction History</h1>

        <p>
          View and filter your past transactions.
        </p>
      </div>

      {/* =========================================
          ERROR
          ========================================= */}

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={() => setError("")}
        />
      )}

      {/* =========================================
          FILTERS
          ========================================= */}

      <div className="card filters-card">
        <div className="filters">

          {/* SEARCH */}

          <div className="form-field form-field--inline">
            <label htmlFor="search">
              Search
            </label>

            <div className="form-field__input-wrap">

              <Search
                size={18}
                className="form-field__icon"
              />

              <input
                id="search"
                type="text"
                placeholder="Search by name, account or transaction ID"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>
          </div>

          {/* STATUS */}

          <div className="form-field form-field--inline">

            <label htmlFor="statusFilter">
              Status
            </label>

            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="all">
                All
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="failed">
                Failed
              </option>

              <option value="reversed">
                Reversed
              </option>
            </select>

          </div>

          {/* REFRESH */}

          <button
            className="btn btn--ghost"
            onClick={loadTransactions}
            type="button"
            disabled={loading}
          >
            <Filter size={18} />

            Refresh
          </button>

        </div>
      </div>

      {/* =========================================
          CONTENT
          ========================================= */}

      {loading ? (
        <Loading message="Loading transactions..." />
      ) : filteredTransactions.length === 0 ? (

        <div className="card empty-state">

          <Receipt size={40} />

          <h3>
            No transactions found
          </h3>

          <p className="muted">
            You don't have any transactions
            matching your search.
          </p>

        </div>

      ) : (

        <div className="card transaction-card">

          <div className="transaction-table-wrapper">

            <table className="transaction-table">

              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                {filteredTransactions.map(
                  (transaction) => {

                    const date =
                      transaction.createdAt
                        ? new Date(
                            transaction.createdAt
                          ).toLocaleString(
                            "en-IN",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          )
                        : "—";

                    const fromName =
                      getUserName(
                        transaction.fromAccount
                      );

                    const toName =
                      getUserName(
                        transaction.toAccount
                      );

                    const fromNumber =
                      getAccountNumber(
                        transaction.fromAccount
                      );

                    const toNumber =
                      getAccountNumber(
                        transaction.toAccount
                      );

                    const fromIsSystem =
                      isSystemUser(
                        transaction.fromAccount?.user
                      );

                    const toIsSystem =
                      isSystemUser(
                        transaction.toAccount?.user
                      );

                    return (
                      <tr
                        key={transaction._id}
                      >

                        {/* =================================
                            TRANSACTION ID
                            ================================= */}

                        <td className="transaction-id-cell">

                          <span className="transaction-id">
                            {transaction._id}
                          </span>

                        </td>

                        {/* =================================
                            FROM
                            ================================= */}

                        <td className="transaction-party-cell">

                          <div className="transaction-party">

                            <strong className="transaction-party__name">
                              {fromName}
                            </strong>

                            {!fromIsSystem &&
                              fromNumber && (
                                <span className="transaction-party__account">
                                  {fromNumber}
                                </span>
                              )}

                          </div>

                        </td>

                        {/* =================================
                            TO
                            ================================= */}

                        <td className="transaction-party-cell">

                          <div className="transaction-party">

                            <strong className="transaction-party__name">
                              {toName}
                            </strong>

                            {!toIsSystem &&
                              toNumber && (
                                <span className="transaction-party__account">
                                  {toNumber}
                                </span>
                              )}

                          </div>

                        </td>

                        {/* =================================
                            AMOUNT
                            ================================= */}

                        <td className="transaction-amount-cell">

                          <strong>
                            {formatCurrency(
                              transaction.amount,
                              transaction.currency ||
                                "INR"
                            )}
                          </strong>

                        </td>

                        {/* =================================
                            STATUS
                            ================================= */}

                        <td className="transaction-status-cell">

                          <span
                            className={`status-badge status-badge--${(
                              transaction.status ||
                              ""
                            ).toLowerCase()}`}
                          >
                            {transaction.status}
                          </span>

                        </td>

                        {/* =================================
                            DATE
                            ================================= */}

                        <td className="transaction-date-cell">
                          {date}
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
}