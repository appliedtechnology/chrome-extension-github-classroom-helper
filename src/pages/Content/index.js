import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

const delay = (timeInMs, callback) => {
  setTimeout(() => {
    callback();
  }, timeInMs);
};

const approvePR = () => {
  delay(500, () => {
    document
      .querySelector('#pull_requests_submit_review [value="approve"]')
      .click();
  });
};

const openReviewForm = () => {
  document.querySelector('.js-review-changes').click();
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case 'OPEN_REVIEW_FORM':
      openReviewForm();
      break;
    case 'APPROVE_PRS':
      approvePR();
      break;
    default:
      break;
  }
});
