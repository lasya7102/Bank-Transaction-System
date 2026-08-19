import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatCurrency } from "../utils/formatCurrency";

export default function AccountCard({
  account,
  balance,
  balanceLoading,
  hideBalance = false,
}) {
  const [showBalance, setShowBalance] = useState(false);
const [showAccountNumber, setShowAccountNumber] = useState(false);
  return (
    <div className="account-card">
      <div className="account-card__header">
        <div className="account-card__id">
          <span className="account-card__label">Account Number</span>
<div className="account-number-row">
  <span className="account-card__value">
    {showAccountNumber
      ? account.accountNumber
      : `•••• •••• ${String(account.accountNumber).slice(-4)}`}
  </span>

  <button
    type="button"
    className="account-number-toggle"
    onClick={() =>
      setShowAccountNumber((prev) => !prev)
    }
    aria-label={
      showAccountNumber
        ? "Hide account number"
        : "Show account number"
    }
  >
    {showAccountNumber ? (
      <EyeOff size={18} />
    ) : (
      <Eye size={18} />
    )}
  </button>
</div>
        </div>

        <StatusBadge status={account.status} />
      </div>

      <div className="account-card__balance">
        <span className="account-card__label">
          Available Balance
        </span>

        {balanceLoading ? (
          <span className="skeleton skeleton--text" />
        ) : hideBalance ? (
          <div className="account-balance-row">
            <span className="account-card__amount">
              ••••••
            </span>
          </div>
        ) : (
          <div className="account-balance-row">
            <span className="account-card__amount">
              {showBalance
                ? formatCurrency(balance, account.currency)
                : "••••••"}
            </span>

            <button
              type="button"
              className="balance-toggle"
              onClick={() => setShowBalance((prev) => !prev)}
              aria-label={
                showBalance
                  ? "Hide balance"
                  : "Show balance"
              }
            >
              {showBalance ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="account-card__footer">
        <div className="account-card__meta">
          <span className="account-card__label">
            Currency
          </span>

          <span className="account-card__value">
            {account.currency || "INR"}
          </span>
        </div>

        <Link
          to="/accounts"
          className="btn btn--ghost btn--sm"
        >
          <Eye size={16} />
          View
        </Link>
      </div>
    </div>
  );
}