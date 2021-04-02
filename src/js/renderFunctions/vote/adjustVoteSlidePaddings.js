import { LANDSCAPE_DEFAULT_WIDTH } from '../../utils/constants/screenDimensions';

export default function adjustVoteSlideIndents() {
  if (globalThis.innerWidth >= LANDSCAPE_DEFAULT_WIDTH) {
    return;
  }

  const votingWrap = document.querySelector(`.voting-layout`);
  const prevButton = document.querySelector(`.voting-layout__button_prev`);
  const nextButton = document.querySelector(`.voting-layout__button_next`);
  const firstPerson = votingWrap.querySelector(`.voting-layout__person_1`);
  const secondPerson = votingWrap.querySelector(`.voting-layout__person_2`);
  const thirdPerson = votingWrap.querySelector(`.voting-layout__person_3`);
  const fifthPerson = votingWrap.querySelector(`.voting-layout__person_5`);
  const seventhPerson = votingWrap.querySelector(`.voting-layout__person_7`);
  const eighthPerson = votingWrap.querySelector(`.voting-layout__person_8`);
  const bigShift = firstPerson.offsetTop.toPrecision(3);
  const smallShift = ((votingWrap.clientHeight - prevButton.clientHeight * 2 - secondPerson.clientHeight * 2) / 5).toPrecision(3);

  prevButton.style.top = `${smallShift}px`;
  nextButton.style.bottom = `${smallShift}px`;
  firstPerson.style.marginTop = `${bigShift}px`;
  secondPerson.style.transform = `translateY(${2 * smallShift + prevButton.clientHeight}px)`;
  thirdPerson.style.marginTop = `${bigShift}px`;
  fifthPerson.style.transform = `translateY(-${2 * smallShift + nextButton.clientHeight}px)`;
  if (eighthPerson) {
    seventhPerson.style.marginBottom = `${bigShift}px`;
    eighthPerson.style.marginBottom = `${bigShift}px`;
  }
}
