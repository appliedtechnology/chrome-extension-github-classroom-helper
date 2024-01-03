import React, { useCallback, useEffect, useState } from 'react';
import { getRepoNameFromStorage, saveRepoNameToStorage } from '../../utils';
import './Popup.css';
import { TabActions } from '../../components/TabActions';
import { TabsList } from '../../components/TabsList';
import { RepoForm } from '../../components/RepoForm';
import { AppTab } from '../../types/tab.type';

const Popup = () => {
  const [tabs, setTabs] = useState<AppTab[]>([]);
  const [uniqueTabs, setUniqueTabs] = useState<string[]>([]);
  const [repo, setRepo] = useState(getRepoNameFromStorage());

  const getTabs = useCallback(async () => {
    const tabs = await chrome.tabs.query({
      url: ['https://github.com/*/pull/*/files'],
    }) as AppTab[];
    const uniqueUrls = new Set<string>();
    const filteredTabs = tabs
      .filter((tab: AppTab) => {
        if (uniqueUrls && uniqueUrls.has(tab.url!)) {
          return false;
        }
        uniqueUrls.add(tab.url!);
        if (!repo) {
          return true;
        }
        return tab.url!.toLowerCase().includes(repo.toLowerCase());
      }).map(tabItem => ({
        ...tabItem,
        isSelected: true
      }));
    if (!tabs.length) {
      return [];
    }

    const prefixRegex = /https:\/\/github\.com\/saltsthlm\//;
    const suffixRegex = /-[\w\d]*\/pull\/\d\/?\w*\/?$/;

    const uniqueTabs = tabs.reduce((accumulator: string[], tab) => {
      const replacedUrl = tab.url?.replace(prefixRegex, '').replace(suffixRegex, '')!;
      if (!accumulator.includes(replacedUrl)) {
        accumulator.push(replacedUrl);
      }
      return accumulator;
    }, []);
    setUniqueTabs(uniqueTabs);
    setTabs(filteredTabs);
    return filteredTabs;
  }, [repo]);

  const sendActionToTabs = (action: any) => {
    tabs.filter(tabItem => (tabItem.isSelected)).forEach(tabItem => {
      const tabId = tabItem.id as number;
      chrome.tabs.sendMessage(tabId, { action });
    })
  };

  const selectAll = () => {
    setTabs(
      tabs.map(tabItem => ({
        ...tabItem,
        isSelected: true
      }))
    )
  }

  const selectNone = () => {
    setTabs(
      tabs.map(tabItem => ({
        ...tabItem,
        isSelected: false
      }))
    )
  }

  const onTabSelectionChange = (tab: AppTab, isSelected: boolean) => {
    setTabs(
      tabs.map((tabItem) => {
        if (tabItem.id === tab.id) {
          return {
            ...tab,
            isSelected
          }
        }
        return tabItem;
      })
    )
  }

  const getSelectedTabsLength = () => {
    return tabs.filter(tabItem => tabItem.isSelected).length
  }

  useEffect(() => {
    saveRepoNameToStorage(repo);
    getTabs();
  }, [repo, getTabs]);

  return (
    <div className="App">
      <header className="text-xl text-center py-2">
        GitHub Review Submitter
      </header>
      <main className="py-4 px-4 max-h-80 overflow-auto">
        <RepoForm
          uniqueTabs={uniqueTabs}
          repo={repo}
          onValueUpdate={(val: string) => {
            setRepo(val);
          }}
        />
        <section className="flex items-center justify-center gap-4 flex-col">
          <TabActions sendActionToTabs={sendActionToTabs} tabs={tabs} />
        </section>
        <section className="mt-4">
          <h2 className="text-lg">Tabs: {getSelectedTabsLength() === tabs.length ? tabs.length : `${getSelectedTabsLength()} / ${tabs.length}`}</h2>
          <div className='flex items-center justify-end gap-2'>
            <small onClick={selectAll} className='cursor-pointer text-purple-500 font-bold hover:text-purple-600'>Select All</small>
            <small>|</small>
            <small onClick={selectNone} className='cursor-pointer text-purple-500 font-bold hover:text-purple-600'>Select None</small>
          </div>
          <TabsList repo={repo} tabs={tabs} onTabSelectionChange={onTabSelectionChange} />
        </section>
      </main>
      <footer className="w-full bg-slate-900 p-3">
        <img src="/saltlogo.svg" className="w-1/3 mx-auto" alt="logo" />
      </footer>
    </div>
  );
};

export default Popup;
