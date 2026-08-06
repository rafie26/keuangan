export default function Icon({
  icon,
  className = "",
}: {
  icon: string;
  className?: string;
}) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {icon}
    </span>
  );
}
