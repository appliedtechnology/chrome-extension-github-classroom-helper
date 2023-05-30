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
          <section className="flex flex-row gap-4">
          <button className='px-3 py-1.5 rounded-md shadow-md bg-purple-700 text-white hover:bg-purple-800 active:bg-purple-1000 focus:bg-purple-500' onClick={() => reloadTabs()}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><title>Reload Tabs</title>
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>
</button>
          <button className='px-3 py-1.5 rounded-md shadow-md bg-purple-700 text-white hover:bg-purple-800 active:bg-purple-1000 focus:bg-purple-500' onClick={() => openReviewForm()}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><title>Open Review Form</title>
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
</svg>

</button>
          <button className='px-3 py-1.5 rounded-md shadow-md bg-purple-700 text-white hover:bg-purple-800 active:bg-purple-1000 focus:bg-purple-500' onClick={() => approvePRs()}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><title>Approve PRs</title>
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
</svg>
</button>
          <button className='px-3 py-1.5 rounded-md shadow-md bg-purple-700 text-white hover:bg-purple-800 active:bg-purple-1000 focus:bg-purple-500' onClick={() => submitReviews()}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><title>Submit Review Form</title>
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>


</button>
</section>
          <p className='text-center my-2'>
            OR submit reviews automagically at once <br/>
            👇🏽
          </p>
          <button className='px-3 py-1.5 rounded-md shadow-md bg-purple-700 text-white hover:bg-purple-800 active:bg-purple-1000 focus:bg-purple-500' onClick={() => openReviewSubmit()}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><title>Open Review Submit</title>
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
</svg>
</button>
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