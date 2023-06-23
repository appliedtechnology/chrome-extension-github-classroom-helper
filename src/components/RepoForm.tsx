import React, { FC, useEffect, useRef } from 'react';

type RepoFormProps = {
  onValueUpdate: (val: string) => void;
  repo: string;
};

export const RepoForm: FC<RepoFormProps> = ({ onValueUpdate, repo }) => {
  const repoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    repoInputRef.current!.value = repo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <input
      onChange={(e) => {
        const val = e.target.value;
        onValueUpdate(val);
      }}
      ref={repoInputRef}
      type="text"
      className="px-3 p-2 mb-4 w-full ring ring-slate-900 rounded-md"
      placeholder="Enter repo name"
    />
  );
};
