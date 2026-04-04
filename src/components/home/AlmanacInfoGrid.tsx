import { explanationMap } from '../../lib/almanac/explanations';
import type { AlmanacField } from '../../lib/almanac/types';

type AlmanacInfoGridProps = {
  title: string;
  fields: AlmanacField[];
};

export function AlmanacInfoGrid({ title, fields }: AlmanacInfoGridProps) {
  return (
    <section className="almanac-info-grid" aria-label={title}>
      <h2>{title}</h2>
      <dl className="almanac-info-grid__list">
        {fields.map((field) => (
          <div key={field.explanationKey} className="almanac-info-grid__item">
            <dt>{field.label}</dt>
            <dd className="almanac-info-grid__value">{field.value}</dd>
            <dd className="almanac-info-grid__description">
              {explanationMap[field.explanationKey].long}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
