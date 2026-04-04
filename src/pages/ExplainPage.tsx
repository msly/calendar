import { Link, useParams } from 'react-router-dom';
import { getExplanationByKey } from '../lib/almanac/explanations';

export function ExplainPage() {
  const { key } = useParams();
  const explanation = getExplanationByKey(key);

  if (!explanation) {
    return (
      <main className="app-shell explain-page">
        <h2>未找到说明内容</h2>
        <p>{key ?? ''}</p>
        <p>
          <Link to="/">返回首页</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="app-shell explain-page">
      <article className="explain-page__article">
        <h2>{explanation.title}</h2>
        <p>{explanation.short}</p>
        <p>{explanation.long}</p>
        <p>
          <Link to="/">返回首页</Link>
        </p>
      </article>
    </main>
  );
}
