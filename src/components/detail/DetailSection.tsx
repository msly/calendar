import { useState, type PropsWithChildren } from 'react';

type DetailSectionProps = PropsWithChildren<{
  title: string;
  defaultOpen?: boolean;
  variant?: 'default' | 'hero';
}>;

export function DetailSection({
  title,
  defaultOpen = false,
  variant = 'default',
  children
}: DetailSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const headingId = `detail-section-${title}`;

  return (
    <section
      className={`detail-section detail-section--${variant}`}
      aria-labelledby={headingId}
    >
      <div className="detail-section__header">
        <h2 id={headingId}>{title}</h2>
        <button
          className="detail-section__toggle"
          type="button"
          onClick={() => setIsOpen((current) => !current)}
        >
        {isOpen ? `收起${title}` : `展开${title}`}
        </button>
      </div>
      {isOpen ? <div className="detail-section__body">{children}</div> : null}
    </section>
  );
}
