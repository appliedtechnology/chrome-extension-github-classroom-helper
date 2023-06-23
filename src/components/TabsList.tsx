import React, { FC } from 'react';
import { getRepoNameFromUrl } from '../utils';

type TabsListProps = {
  tabs: chrome.tabs.Tab[];
  repo: string;
};

export const TabsList: FC<TabsListProps> = ({ tabs, repo }) => {
  const makeTabActive = (tab: chrome.tabs.Tab) => {
    const tabId = tab.id as number;
    chrome.tabs.update(tabId, {
      active: true,
    });
    tab.active = true;
  };
  return (
    <ul className="flex flex-col gap-4 pt-4">
      {tabs?.map((tab: chrome.tabs.Tab) => {
        const repoName = getRepoNameFromUrl(tab, repo);
        return (
          <li
            key={repoName}
            onClick={() => {
              makeTabActive(tab);
            }}
            className="px-2 py-1 border rounded-md break-words whitespace-pre-wrap hover:bg-purple-700 hover:text-white cursor-pointer duration-200"
          >
            {repoName}
          </li>
        );
      })}
    </ul>
  );
};
