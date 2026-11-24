// A Google "Material Symbols" icon, e.g. <Icon name="add" />
export default function Icon({ name, className = '' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}
