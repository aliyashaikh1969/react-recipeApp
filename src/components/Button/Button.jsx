import { Link } from 'react-router-dom'

const baseClasses =
  'inline-flex items-center justify-center gap-2 text-center cursor-pointer transition duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed'

const pillClasses = 'rounded-full text-sm font-semibold uppercase tracking-wide'

const variantClasses = {
  primary: `${pillClasses} bg-ink text-white shadow-sm hover:bg-brand-500 hover:shadow-md`,
  secondary: `${pillClasses} bg-white text-ink border border-line shadow-sm hover:border-brand-500 hover:text-brand-600 hover:shadow-md`,
  link: 'text-sm font-medium text-body underline underline-offset-4 hover:text-brand-600',
}

const sizeClasses = {
  medium: 'px-6 py-3',
  large: 'px-10 py-4',
}

// The one button style used across the app.
// It renders a router <Link> when `to` is given, a normal <a> when `href` is given, and a <button> otherwise.
// variant: "primary" | "secondary" | "link"     size: "medium" | "large" (the "link" variant has no size)
export const Button = ({ to, href, variant = 'primary', size = 'medium', className = '', ...props }) => {
  const sizeClass = variant === 'link' ? '' : sizeClasses[size]
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClass} ${className}`

  if (to) return <Link to={to} className={classes} {...props} />
  if (href) return <a href={href} className={classes} {...props} />
  return <button type="button" className={classes} {...props} />
}
