const StudyDetailCell = ({ pubAuthor, pubDate, traitReported, pubJournal }) => {
  let pubInfo = '';
  if (pubAuthor && pubDate) {
    pubInfo = ` ${pubAuthor} ${new Date(pubDate).getFullYear()}`;
  }
  return (
    <>
      <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
        {traitReported}
      </span>
      <br />
      <span style={{ fontSize: '0.75rem' }}>{pubInfo}</span>
      <span style={{ fontSize: '0.65rem', fontStyle: 'italic' }}>
        {' '}
        {pubJournal}
      </span>
    </>
  );
};

export default StudyDetailCell;
