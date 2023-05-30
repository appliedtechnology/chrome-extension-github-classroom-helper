import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

const delay = (timeInMs) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeInMs);
  });
};

const approvePR = () => {
  document
    .querySelector('#pull_requests_submit_review [value="approve"]')
    .click();
};

const submitReviews = () => {
  const buttons = document.querySelectorAll('#review-changes-modal button');
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].textContent.toLowerCase().trim() === 'submit review') {
      buttons[i].click();
      break;
    }
  }
};

const openReviewForm = () => {
  document.querySelector('.js-review-changes').click();
};

const openReviewSubmit = async () => {
  openReviewForm();
  await delay(300);
  approvePR();
  await delay(300);
  submitReviews();
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case 'OPEN_REVIEW_FORM':
      openReviewForm();
      break;
    case 'APPROVE_PRS':
      approvePR();
      break;
    case 'SUBMIT_REVIEWS':
      submitReviews();
      break;
    case 'OPEN_REVIEW_SUBMIT':
      openReviewSubmit();
      break;
    default:
      break;
  }
});
