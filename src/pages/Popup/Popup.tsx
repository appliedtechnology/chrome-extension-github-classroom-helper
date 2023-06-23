import React, { useCallback, useEffect, useState } from 'react';
import { getRepoNameFromStorage, saveRepoNameToStorage } from '../../utils';
import './Popup.css';
import { TabActions } from '../../components/TabActions';
import { TabsList } from '../../components/TabsList';
import { RepoForm } from '../../components/RepoForm';

const Popup = () => {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [repo, setRepo] = useState(getRepoNameFromStorage());

  const getTabs = useCallback(async () => {
    const tabs = await chrome.tabs.query({
      url: ['https://github.com/*/pull/*/files'],
    });
    console.log({ tabs });
    const filteredTabs = tabs.filter((tab: chrome.tabs.Tab) => {
      if (!repo) {
        return true;
      }
      return tab.url!.toLowerCase().includes(repo.toLowerCase());
    });
    if (!tabs.length) {
      return [];
    }
    setTabs(filteredTabs);
    return filteredTabs;
  }, [repo]);

  const sendActionToTabs = (action: any) => {
    for (let i = 0; i < tabs.length; i++) {
      const tabId = tabs[i].id as number;
      chrome.tabs.sendMessage(tabId, { action });
    }
  };

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
          repo={repo}
          onValueUpdate={(val: string) => {
            setRepo(val);
          }}
        />
        <section className="flex items-center justify-center gap-4 flex-col">
          <TabActions sendActionToTabs={sendActionToTabs} getTabs={getTabs} />
        </section>
        <section className="mt-4">
          <h2 className="text-lg">Tabs: {tabs.length}</h2>
          <TabsList repo={repo} tabs={tabs} />
        </section>
      </main>
      <footer className="w-full bg-slate-900 p-3">
        <img src="/saltlogo.svg" className="w-1/3 mx-auto" alt="logo" />
      </footer>
    </div>
  );
};

export default Popup;
