import { STATUS_LABEL } from '../api'

export function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{STATUS_LABEL[status]}</span>
}
