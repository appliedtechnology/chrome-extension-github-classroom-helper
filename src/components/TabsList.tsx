import React, { FC } from 'react';
import { getRepoNameFromUrl } from '../utils';
import { AppTab } from '../types/tab.type';

type TabsListProps = {
  tabs: AppTab[];
  repo: string;
  onTabSelectionChange: (tab: AppTab, checked: boolean) => void
};

export const TabsList: FC<TabsListProps> = ({ tabs, repo, onTabSelectionChange }) => {
  /**
   * Commenting for later usage
   */
  // const makeTabActive = (tab: AppTab) => {
  //   const tabId = tab.id as number;
  //   chrome.tabs.update(tabId, {
  //     active: true,
  //   });
  //   tab.active = true;
  // };
  return (
    <ul className="flex flex-col gap-4 pt-4">
      {tabs?.map((tab: AppTab) => {
        const repoName = getRepoNameFromUrl(tab, repo);
        return (
          <li
            key={tab.id}
            className="px-2 py-1 w-full border rounded-md break-words whitespace-pre-wrap hover:bg-purple-700 hover:text-white cursor-pointer duration-200"
          >
            <label htmlFor={`tab_id_${tab.id}`} className='cursor-pointer w-full h-full flex items-center gap-4 '>
              <input id={`tab_id_${tab.id}`} type='checkbox' onChange={(e) => {
                const target = e.target as HTMLInputElement;
                onTabSelectionChange(tab, target.checked);
              }} checked={tab.isSelected} /> <span>{repoName}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
};
