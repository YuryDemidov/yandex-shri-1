import renderPersonCard from '../common/renderPersonCard';

export default function renderVotingCandidates(person, slideData, index) {
  const actionParams = JSON.stringify({
    alias: `leaders`,
    data: {
      selectedUserId: person.id
    }
  });

  return `
    <li class="voting-layout__person voting-layout__person_${index + 1}">
      <a class="voting-layout__candidate-link" href="#" data-action="update" data-params=${actionParams}>
        ${renderPersonCard(person, null, slideData.selectedUserId, null)}
      </a>
    </li>
  `;
}
