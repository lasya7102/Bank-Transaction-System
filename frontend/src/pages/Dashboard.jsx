import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  CheckCircle2,
  ArrowLeftRight,
  Plus,
  Receipt,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import * as accountService from "../services/accountService";
import * as transactionService from "../services/transactionService";

import AccountCard from "../components/AccountCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import { formatCurrency } from "../utils/formatCurrency";

export default function Dashboard() {
  const { user } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showBalance, setShowBalance] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  // ============================================================
  // LOAD ACCOUNTS
  // ============================================================

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

  // ============================================================
  // LOAD RECENT TRANSACTIONS
  // ============================================================

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data =
          await transactionService.getTransactions();

        setTransactions(data.transactions || []);
      } catch (err) {
        console.error(
          "Failed to load transactions:",
          err
        );
      } finally {
        setTransactionsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // ============================================================
  // BALANCE
  // ============================================================

  const visibleAccounts = user?.systemUser
    ? []
    : accounts;

  const totalBalance = visibleAccounts.reduce(
    (sum, acc) =>
      sum +
      (typeof balances[acc._id] === "number"
        ? balances[acc._id]
        : 0),
    0
  );

  const activeCount = accounts.filter(
    (account) => account.status === "ACTIVE"
  ).length;

  const balancesLoaded =
    Object.keys(balances).length === accounts.length &&
    accounts.length > 0;

  // ============================================================
  // QUICK ACTIONS
  // ============================================================

  const quickActions = [
    ...(!user?.systemUser
      ? [
          {
            to: "/transfer",
            label: "Transfer Money",
            icon: ArrowLeftRight,
          },
        ]
      : []),

    {
      to: "/accounts",
      label: "My Accounts",
      icon: Wallet,
    },

    {
      to: "/transactions",
      label: "Transaction History",
      icon: Receipt,
    },

    {
      to: "/accounts",
      label: "Manage Accounts",
      icon: Plus,
    },
  ];

  // ============================================================
  // TRANSACTION HELPERS
  // ============================================================

  const getAccountName = (account) => {
    if (!account) {
      return "Unknown";
    }

    if (typeof account === "string") {
      return account;
    }

    if (account.user?.name) {
      return account.user.name;
    }

    if (account.name) {
      return account.name;
    }

    return "Unknown";
  };

  const getAccountNumber = (account) => {
    if (!account) {
      return "Unknown";
    }

    if (typeof account === "string") {
      return account;
    }

    return (
      account.accountNumber ||
      account._id ||
      "Unknown"
    );
  };

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) {
      return "Unknown";
    }

    const value = String(accountNumber);

    if (value.length <= 4) {
      return `••••${value}`;
    }

    return `••••${value.slice(-4)}`;
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="page">

      {/* ======================================================
          PAGE HEADER
          ====================================================== */}

      <div className="page__header">
        <h1>Dashboard</h1>

        <p>
          Here's an overview of your accounts and balances.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={() => setError("")}
        />
      )}

      {/* ======================================================
          LOADING
          ====================================================== */}

      {loading ? (
        <Loading message="Loading accounts..." />
      ) : (
        <>

          {/* ==================================================
              SUMMARY CARDS
              ================================================== */}

          <div className="summary-grid">

            {/* TOTAL BALANCE */}

            <div className="summary-card summary-card--primary">

              <div className="summary-card__top">
                <span>Total Balance</span>

                <TrendingUp size={22} />
              </div>

              <div className="summary-card__balance">

                <span className="summary-card__value">
                  {user?.systemUser
                    ? "—"
                    : balancesLoaded
                    ? showBalance
                      ? new Intl.NumberFormat(
                          "en-IN",
                          {
                            style: "currency",
                            currency: "INR",
                          }
                        ).format(totalBalance)
                      : "***"
                    : "—"}
                </span>

                {!user?.systemUser &&
                  balancesLoaded && (
                    <button
                      type="button"
                      className="balance-toggle"
                      onClick={() =>
                        setShowBalance(
                          (prev) => !prev
                        )
                      }
                      aria-label={
                        showBalance
                          ? "Hide balance"
                          : "Show balance"
                      }
                    >
                      {showBalance ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  )}

              </div>

            </div>

            {/* ACCOUNTS */}

            <div className="summary-card">

              <div className="summary-card__top">
                <span>Accounts</span>

                <Wallet size={22} />
              </div>

              <span className="summary-card__value">
                {accounts.length}
              </span>

            </div>

            {/* ACTIVE ACCOUNTS */}

            <div className="summary-card">

              <div className="summary-card__top">
                <span>Active Accounts</span>

                <CheckCircle2 size={22} />
              </div>

              <span className="summary-card__value">
                {activeCount}
              </span>

            </div>

          </div>

          {/* ==================================================
              QUICK ACTIONS
              ================================================== */}

          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>

          <div className="quick-actions">

            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.label}
                  to={action.to}
                  className="quick-action-card"
                >
                  <Icon size={22} />

                  <span>
                    {action.label}
                  </span>
                </Link>
              );
            })}

          </div>

          {/* ==================================================
              YOUR ACCOUNTS
              ================================================== */}

          <div className="section-header">

            <h2>Your Accounts</h2>

            <Link
              to="/accounts"
              className="link"
            >
              View all
            </Link>

          </div>

          {accounts.length === 0 ? (

            <EmptyState
              icon={Wallet}
              title="No accounts yet"
              description="Create your first account to get started."
              action={
                <Link
                  to="/accounts"
                  className="btn btn--primary"
                >
                  <Plus size={18} />
                  Create Account
                </Link>
              }
            />

          ) : (

            <div className="account-grid">

              {accounts
                .slice(0, 4)
                .map((acc) => (
                  <AccountCard
                    key={acc._id}
                    account={acc}
                    balance={balances[acc._id]}
                    balanceLoading={
                      typeof balances[
                        acc._id
                      ] !== "number"
                    }
                    hideBalance={
                      user?.systemUser
                    }
                  />
                ))}

            </div>

          )}

          {/* ==================================================
              RECENT TRANSACTIONS
              ================================================== */}

          <div className="section-header">

            <h2>Recent Transactions</h2>

            <Link
              to="/transactions"
              className="link"
            >
              View all
            </Link>

          </div>

          {transactionsLoading ? (

            <p className="muted">
              Loading recent transactions...
            </p>

          ) : transactions.length === 0 ? (

            <EmptyState
              icon={Clock}
              title="No transactions yet"
              description="Your recent transactions will appear here."
            />

          ) : (

            <div className="transactions-list">

              {transactions
                .slice(0, 5)
                .map((transaction) => {

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
                    getAccountName(
                      transaction.fromAccount
                    );

                  const toName =
                    getAccountName(
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
                    transaction
                      .fromAccount
                      ?.user
                      ?.systemUser === true;

                  const toIsSystem =
                    transaction
                      .toAccount
                      ?.user
                      ?.systemUser === true;

                  return (
                    <div
                      key={transaction._id}
                      className="transaction-item"
                    >

                      {/* FROM */}

                      <div className="transaction-party">

                        <span className="transaction-party__label">
                          From
                        </span>

                        <strong className="transaction-party__name">
                          {fromName}
                        </strong>

                        {!fromIsSystem && (
                          <span className="transaction-party__account">
                            {maskAccountNumber(
                              fromNumber
                            )}
                          </span>
                        )}

                      </div>

                      {/* ARROW */}

                      <div className="transaction-item__arrow">

                        <ArrowLeftRight
                          size={18}
                          strokeWidth={1.8}
                        />

                      </div>

                      {/* TO */}

                      <div className="transaction-party">

                        <span className="transaction-party__label">
                          To
                        </span>

                        <strong className="transaction-party__name">
                          {toName}
                        </strong>

                        {!toIsSystem && (
                          <span className="transaction-party__account">
                            {maskAccountNumber(
                              toNumber
                            )}
                          </span>
                        )}

                      </div>

                      {/* DATE */}

                      <div className="transaction-item__date">

                        <Clock size={14} />

                        <span>
                          {date}
                        </span>

                      </div>

                      {/* AMOUNT + STATUS */}

                      <div className="transaction-item__right">

                        <strong className="transaction-item__amount">
                          {formatCurrency(
                            transaction.amount,
                            transaction.currency ||
                              "INR"
                          )}
                        </strong>

                        <span
                          className={`status-badge status-badge--${(
                            transaction.status ||
                            ""
                          ).toLowerCase()}`}
                        >
                          {transaction.status}
                        </span>

                      </div>

                    </div>
                  );
                })}

            </div>

          )}

        </>
      )}

    </div>
  );
}