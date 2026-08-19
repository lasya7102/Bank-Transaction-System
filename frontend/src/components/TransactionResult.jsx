import { ArrowRight, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";

export default function TransactionResult({ transaction }) {
  if (!transaction) return null;

  const {
    _id,
    fromAccount,
    toAccount,
    amount,
    status,
    currency = "INR",
    createdAt,
  } = transaction;

  const date = createdAt ? new Date(createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }) : "—";

  return (
    <div className="transaction-result">
      <div className="transaction-result__header">
        <div className="transaction-result__icon">
          <CheckCircle2 size={32} />
        </div>
        <h3>Transaction completed successfully</h3>
      </div>

      <div className="transaction-result__flow">
        <div className="transaction-result__account">
          <span className="transaction-result__label">From</span>
          <span className="transaction-result__value">{fromAccount}</span>
        </div>
        <ArrowRight className="transaction-result__arrow" size={20} />
        <div className="transaction-result__account">
          <span className="transaction-result__label">To</span>
          <span className="transaction-result__value">{toAccount}</span>
        </div>
      </div>

      <div className="transaction-result__details">
        <div className="transaction-result__row">
          <span>Transaction ID</span>
          <span>{_id}</span>
        </div>
        <div className="transaction-result__row">
          <span>Amount</span>
          <span className="transaction-result__amount">
            {formatCurrency(amount, currency)}
          </span>
        </div>
        <div className="transaction-result__row">
          <span>Status</span>
          <span className={`status-badge status-badge--${(status || "").toLowerCase()}`}>
            {status || "—"}
          </span>
        </div>
        <div className="transaction-result__row">
          <span>Date</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}
