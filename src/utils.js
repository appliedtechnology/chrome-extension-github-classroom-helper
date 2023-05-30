const STORAGE_KEYS = {
  SEARCHED_REPO_NAME: 'gch-searched-repo',
};
export const getRepoNameFromUrl = (tab, repo = '') => {
  const urlChunks = tab.url.split('/');
  let repoName = urlChunks[urlChunks.indexOf('pull') - 1];
  if (!repo) {
    return repoName;
  }
  repoName = repoName.replaceAll(`${repo}-`, '');
  return repoName;
};

export const saveRepoNameToStorage = (repoName) => {
  localStorage.setItem(STORAGE_KEYS.SEARCHED_REPO_NAME, repoName);
};

export const getRepoNameFromStorage = () => {
  return localStorage.getItem(STORAGE_KEYS.SEARCHED_REPO_NAME) || '';
};
