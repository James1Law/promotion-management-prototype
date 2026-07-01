import { Link, useParams } from 'react-router-dom';
import { seafarerById } from '../data/seafarers';
import { Shell } from '../components/layout/Shell';
import { Card, CardBody } from '../components/ui/Card';
import { EvaluationsPanel } from '../components/promotion/EvaluationsPanel';
import { LicencesPanel } from '../components/promotion/LicencesPanel';

/**
 * Deep-link targets for the "open in new tab" links on the promotion form
 * (Evaluations / Document Management). These stand in for existing OOS modules.
 */
export function StubPage({ kind }: { kind: 'evaluations' | 'documents' }) {
  const { id = '' } = useParams();
  const seafarer = seafarerById(id);
  const title = kind === 'evaluations' ? 'Evaluations' : 'Document Management';

  return (
    <Shell title={title}>
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-3 text-sm text-muted">
          <Link to={`/seafarer/${id}`} className="hover:text-teal">
            {seafarer?.name ?? 'Seafarer'}
          </Link>{' '}
          / {title}
        </div>
        <Card className="mb-4">
          <CardBody>
            <p className="text-sm text-muted">
              This is a placeholder for the existing <strong>{title}</strong> module in OpenOcean
              Studio, shown here to demonstrate the deep link from the promotion form.
            </p>
          </CardBody>
        </Card>
        {seafarer &&
          (kind === 'evaluations' ? (
            <EvaluationsPanel seafarer={seafarer} />
          ) : (
            <LicencesPanel seafarer={seafarer} />
          ))}
      </div>
    </Shell>
  );
}
