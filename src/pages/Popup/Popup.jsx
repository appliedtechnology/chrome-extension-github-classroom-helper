import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getRepoNameFromStorage, getRepoNameFromUrl, saveRepoNameToStorage } from '../../utils';
import './Popup.css';
import logo from '../../assets/img/saltlogo.svg';

const Popup = () => {
  const [tabs, setTabs] = useState([]);
  const [repo, setRepo] = useState(getRepoNameFromStorage());
  const repoInputRef = useRef(null);
  
  const getTabs = useCallback(async () => {
    const tabs = await chrome.tabs.query({
      url: [
        'https://github.com/*/pull/*/files',
      ]
    });
    console.log({tabs})
    const filteredTabs = tabs.filter((tab) => {
      if (!repo) {
        return true;
      }
      return tab.url.includes(repo);
    });
    if (!tabs.length) {
      return [];
    }
    if (!repo) {
      const repoName = getRepoNameFromUrl(tabs[0]);
      repoInputRef.current.value = repoName;
      setRepo('repoName');
      return filteredTabs;
    }
    setTabs(filteredTabs);
    return filteredTabs;
  }, [repo])

  const reloadTabs = async () => {
    const tabs = await getTabs();
    for (let i = 0; i < tabs.length; i++) {
      chrome.tabs.reload(tabs[i].id,)
    }
  }

  const sendActionToTabs = (action) => {
    for (let i = 0; i < tabs.length; i++) {
      chrome.tabs.sendMessage(tabs[i].id, {action});
    }
  }

  const makeTabActive = (tab) => {
    chrome.tabs.update(tab.id, {
      active: true
    })
    tab.active = true;
  }

  const approvePRs = () => {
    sendActionToTabs('APPROVE_PRS')
  }

  const openReviewForm = () => {
    sendActionToTabs('OPEN_REVIEW_FORM')
  }

  const submitReviews = () => {
    sendActionToTabs('SUBMIT_REVIEWS');
  }

  const openReviewSubmit = () => {
    sendActionToTabs('OPEN_REVIEW_SUBMIT');
  }

  useEffect(() => {
    if (repo && !repoInputRef.current.value) {
      repoInputRef.current.value = repo;
    }
    saveRepoNameToStorage(repo);
    getTabs();
  }, [repo, getTabs])

  return (
    <div className="App">
      <header className="text-xl text-center py-2">
        GitHub Review Submitter
      </header>
      <main className='py-4 px-4 max-h-80 overflow-auto'>
        <input onChange={(e) => {
            const val = e.target.value;
            setRepo(val);
          }}
          ref={repoInputRef}
          type='text'
          className='px-3 p-2 mb-4 w-full ring ring-slate-900 rounded-md'
          placeholder='Enter repo name'/>
        <section className="flex items-center justify-center gap-4 flex-col">
          <button className='px-3 py-1.5 rounded-md shadow-md bg-purple-700 text-white hover:bg-purple-800' onClick={() => reloadTabs()}>Reload Tabs</button>
          <button className='px-3 py-1.5 rounded-md shadow-md bg-purple-700 text-white hover:bg-purple-800' onClick={() => openReviewForm()}>Open Review Forms</button>
          <button className='px-3 py-1.5 rounded-md shadow-md bg-purple-700 text-white hover:bg-purple-800' onClick={() => approvePRs()}>Approve PRs</button>
          <button className='px-3 py-1.5 rounded-md shadow-md bg-purple-700 text-white hover:bg-purple-800' onClick={() => submitReviews()}>Submit Reviews</button>
          <p className='text-center my-2'>
            OR submit reviews automagically at once <br/>
            👇🏽
          </p>
          <button className='px-3 py-1.5 rounded-md shadow-md bg-purple-700 text-white hover:bg-purple-800' onClick={() => openReviewSubmit()}>Open Review Submit</button>
        </section>
        <section className='mt-4'>
          <h2 className='text-lg'>Tabs:</h2>
          <ul className='flex flex-col gap-4 pt-4'>
            {
              tabs?.map(tab => {
                const repoName = getRepoNameFromUrl(tab, repo);
                return <li onClick={() => {
                  makeTabActive(tab);
                }} className='px-2 py-1 border rounded-md break-words whitespace-pre-wrap hover:bg-purple-700 hover:text-white cursor-pointer duration-200'>{
                  repoName
                }</li>
              })
            }
          </ul>
        </section>
      </main>
      <footer className='w-full bg-slate-900 p-3'>
        <img src={logo} className="w-1/3 mx-auto" alt="logo"  />
      </footer>
    </div>
  );
};

export default Popup;
