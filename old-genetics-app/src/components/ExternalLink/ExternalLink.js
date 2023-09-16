import { Link } from '../../ot-ui-components';

function ExternalLink({ title, id, url }) {
  if (!id) return null;

  return (
    <span>
      {title}:{' '}
      <Link external to={url}>
        {id}
      </Link>
    </span>
  );
}

export default ExternalLink;
