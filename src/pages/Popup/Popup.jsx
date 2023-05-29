import React, { useEffect, useState } from 'react';
import './Popup.css';

const Popup = () => {
  const [tabs, setTabs] = useState([]);
  
  const getTabs = async () => {
    const tabs = await chrome.tabs.query({
      url: [
        'https://github.com/*/pull/*/files',
      ]
    });
    console.log({tabs})
    setTabs(tabs);
  }

  const reloadTabs = () => {
    for (let i = 0; i < tabs.length; i++) {
      chrome.tabs.reload(tabs[i].id,)
    }
  }

  const sendActionToTabs = (action) => {
    for (let i = 0; i < tabs.length; i++) {
      chrome.tabs.sendMessage(tabs[i].id, {action});
    }
  }

  const approvePRs = () => {
    sendActionToTabs('APPROVE_PRS')
  }

  const openReviewForm = () => {
    sendActionToTabs('OPEN_REVIEW_FORM')
  }

  useEffect(() => {
    getTabs();
  }, [])

  return (
    <div className="App">
      <header className="text-xl text-center pt-4">
        GitHub Review Submitter
      </header>
      <div className="flex items-center justify-center gap-4 flex-col">
        <button className='px-3 py-1.5 rounded-md shadow-md bg-purple-900 text-white hover:bg-purple-700' onClick={() => reloadTabs()}>Reload Tabs</button>
        <button className='px-3 py-1.5 rounded-md shadow-md bg-purple-900 text-white hover:bg-purple-700' onClick={() => openReviewForm()}>Open Review Forms</button>
        <button className='px-3 py-1.5 rounded-md shadow-md bg-purple-900 text-white hover:bg-purple-700' onClick={() => approvePRs()}>Approve PRs</button>
      </div>
    </div>
  );
};

export default Popup;
