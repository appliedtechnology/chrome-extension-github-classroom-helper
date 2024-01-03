import React, { FC, useEffect, useRef } from 'react';

type RepoFormProps = {
  onValueUpdate: (val: string) => void;
  repo: string;
  uniqueTabs: string[];
};

export const RepoForm: FC<RepoFormProps> = ({ onValueUpdate, repo, uniqueTabs }) => {
  const repoSelectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (repoSelectRef.current) {
      repoSelectRef.current.value = repo;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo]);

  return (
    <select
      onChange={(e) => {
        const val = e.target.value;
        onValueUpdate(val);
      }}
      ref={repoSelectRef}
      className="px-3 p-2 mb-4 w-full ring ring-slate-900 rounded-md"
    >
      {uniqueTabs.map((repoOption: any) => (
        <option key={repoOption} value={repoOption}>
          {repoOption}
        </option>
      ))}
    </select>
  );
};
