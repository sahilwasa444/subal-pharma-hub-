import { Link } from "react-router-dom";

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = ""
}) {
  return (
    <div className={`card empty-state ${className}`.trim()}>
      {Icon ? (
        <div className="empty-state__icon" aria-hidden="true">
          <Icon size={18} />
        </div>
      ) : null}

      <div>
        <h3 className="section-title">{title}</h3>
        {description ? <p className="page-subtitle">{description}</p> : null}
      </div>

      {action ? <div className="empty-state__actions">{action}</div> : null}
    </div>
  );
}

export function EmptyStateLink({
  icon: Icon,
  title,
  description,
  actionLabel,
  to,
  className = ""
}) {
  return (
    <EmptyState
      icon={Icon}
      title={title}
      description={description}
      className={className}
      action={
        <Link className="btn btn--primary" to={to}>
          {actionLabel}
        </Link>
      }
    />
  );
}

export default EmptyState;
