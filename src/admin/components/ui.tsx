import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowDown, ArrowUp, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Shared admin UI kit. Every /admin page is built from these so spacing,
// colour and focus treatment stay consistent. Keep variants small; add a prop
// before adding a one-off class string in a page.
// ---------------------------------------------------------------------------

export const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all ' +
  'hover:border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 ' +
  'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500';

export const PageHeader = ({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) => (
  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">{eyebrow}</p>}
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
      {description && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">{description}</p>}
    </div>
    {actions && <div className="flex flex-shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export const Card = ({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
  flush = false,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Remove body padding (for full-bleed lists). */
  flush?: boolean;
}) => (
  <section className={cn('overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm', className)}>
    {(title || actions) && (
      <header className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
          {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
        </div>
        {actions && <div className="flex flex-shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </header>
    )}
    <div className={cn(!flush && 'p-5 sm:p-6', bodyClassName)}>{children}</div>
  </section>
);

export const SectionLabel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn('text-xs font-semibold uppercase tracking-[0.16em] text-slate-400', className)}>{children}</p>
);

export const Field = ({
  label,
  hint,
  required,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: ReactNode;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
      {required && <span className="ml-0.5 text-emerald-600">*</span>}
    </label>
    {children}
    {hint && <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{hint}</p>}
  </div>
);

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={cn(inputClass, className)} />
);

export const Textarea = ({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={cn(inputClass, 'min-h-[2.75rem] resize-y leading-relaxed', className)} />
);

export const Select = ({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={cn(inputClass, 'cursor-pointer pr-9', className)}>
    {children}
  </select>
);

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-sm shadow-emerald-600/20 hover:from-green-500 hover:to-emerald-500 hover:shadow-md hover:shadow-emerald-500/25',
  secondary: 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  danger: 'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100',
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: LucideIcon;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, icon: Icon, children, className, disabled, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-60',
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  )
);
Button.displayName = 'Button';

export const IconButton = ({
  label,
  icon: Icon,
  tone = 'default',
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: LucideIcon;
  tone?: 'default' | 'danger';
}) => (
  <button
    type={type}
    aria-label={label}
    title={label}
    className={cn(
      'inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-30',
      tone === 'danger' ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-emerald-50 hover:text-emerald-700',
      className
    )}
    {...props}
  >
    <Icon className="h-4 w-4" />
  </button>
);

type BadgeTone = 'neutral' | 'emerald' | 'amber' | 'red' | 'blue' | 'slate';

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-600',
  slate: 'bg-slate-900 text-white',
  emerald: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/15',
  amber: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/15',
  red: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/15',
  blue: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/15',
};

export const Badge = ({ tone = 'neutral', children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) => (
  <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold leading-4', BADGE_TONES[tone], className)}>
    {children}
  </span>
);

export const Chips = ({ items, max = 8 }: { items: string[]; max?: number }) => {
  if (items.length === 0) return null;
  const shown = items.slice(0, max);
  const rest = items.length - shown.length;
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((item) => (
        <Badge key={item}>{item}</Badge>
      ))}
      {rest > 0 && <Badge tone="neutral">+{rest}</Badge>}
    </div>
  );
};

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) => (
  <div className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}>
    {Icon && (
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon className="h-5 w-5" />
      </div>
    )}
    <p className="text-sm font-semibold text-slate-900">{title}</p>
    {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-lg bg-slate-200/70', className)} />
);

export const PageSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <div aria-busy="true" aria-label="Loading">
    <Skeleton className="mb-2 h-8 w-48" />
    <Skeleton className="mb-8 h-4 w-80 max-w-full" />
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-28 w-full rounded-2xl" />
      ))}
    </div>
  </div>
);

export const Switch = ({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    title={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={cn(
      'relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50',
      checked ? 'bg-emerald-500' : 'bg-slate-300'
    )}
  >
    <span
      className={cn(
        'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
        checked ? 'translate-x-[22px]' : 'translate-x-0.5'
      )}
    />
  </button>
);

export const ReorderButtons = ({
  onUp,
  onDown,
  disableUp,
  disableDown,
  busy,
}: {
  onUp: () => void;
  onDown: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
  busy?: boolean;
}) => (
  <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/80 p-0.5">
    <IconButton label="Move up" icon={ArrowUp} onClick={onUp} disabled={disableUp || busy} className="h-7 w-7" />
    <IconButton label="Move down" icon={ArrowDown} onClick={onDown} disabled={disableDown || busy} className="h-7 w-7" />
  </div>
);

export const Tabs = <T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { key: T; label: string; icon?: LucideIcon; count?: number }[];
  value: T;
  onChange: (key: T) => void;
  className?: string;
}) => (
  <div role="tablist" className={cn('inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm', className)}>
    {tabs.map(({ key, label, icon: Icon, count }) => {
      const active = key === value;
      return (
        <button
          key={key}
          role="tab"
          type="button"
          aria-selected={active}
          onClick={() => onChange(key)}
          className={cn(
            'inline-flex h-9 flex-shrink-0 items-center gap-2 rounded-lg px-3.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/25',
            active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          )}
        >
          {Icon && <Icon className="h-4 w-4" />}
          {label}
          {typeof count === 'number' && (
            <span className={cn('rounded-full px-1.5 text-[11px] font-semibold', active ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500')}>
              {count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export const Kbd = ({ children }: { children: ReactNode }) => (
  <kbd className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-slate-200 bg-white px-1 font-sans text-[10px] font-semibold text-slate-500 shadow-sm">
    {children}
  </kbd>
);

/** Parse a comma-separated input into trimmed, de-duplicated values. */
// eslint-disable-next-line react-refresh/only-export-components
export function splitList(text: string): string[] {
  return Array.from(new Set(text.split(',').map((item) => item.trim()).filter(Boolean)));
}

/** URL-slug a title: "Zion Shop" -> "zion-shop". */
// eslint-disable-next-line react-refresh/only-export-components
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
