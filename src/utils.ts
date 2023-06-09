const STORAGE_KEYS = {
  SEARCHED_REPO_NAME: 'gch-searched-repo',
};
export const getRepoNameFromUrl = (tab: chrome.tabs.Tab, repo = '') => {
  const urlChunks = tab.url!.split('files');
  let repoName = urlChunks[0];
  if (!repo) {
    return repoName;
  }
  return repoName;
};

export const saveRepoNameToStorage = (repoName: string) => {
  localStorage.setItem(STORAGE_KEYS.SEARCHED_REPO_NAME, repoName);
};

export const getRepoNameFromStorage = () => {
  return localStorage.getItem(STORAGE_KEYS.SEARCHED_REPO_NAME) || '';
};
