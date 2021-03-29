import renderPersonCard from '../common/renderPersonCard';

export default function renderVotingCandidates(person, slideData) {
  const actionParams = JSON.stringify({
    alias: `leaders`,
    data: {
      selectedUserId: person.id
    }
  });

  return `
    <li class="voting-layout__person">
      <a href="#" data-action="update" data-params=${actionParams}>
        ${renderPersonCard(person, null, person.id === slideData.selectedUserId, null)}
      </a>
    </li>
  `;
}
