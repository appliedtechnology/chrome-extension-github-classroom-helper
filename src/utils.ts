import { AppTab } from './types/tab.type';

const STORAGE_KEYS = {
  SEARCHED_REPO_NAME: 'gch-searched-repo',
};
export const getRepoNameFromUrl = (tab: AppTab) => {
  const urlChunks = tab.url!.split('files');
  const repoName = urlChunks[0];
  return repoName;
};

export const saveRepoNameToStorage = (repoName: string) => {
  localStorage.setItem(STORAGE_KEYS.SEARCHED_REPO_NAME, repoName);
};

export const getRepoNameFromStorage = () => {
  return localStorage.getItem(STORAGE_KEYS.SEARCHED_REPO_NAME) || '';
};
