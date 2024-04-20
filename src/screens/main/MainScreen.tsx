import { Repository } from '../../models/RepositoryModel';
import RepositoryList from './components/RepositoryList';
import UserSearch from './components/UserSearch';
import React, { useState } from 'react';
import { fetchUserRepositories } from '../../services/githubService';

export default function MainView() {
    const [repoList, setRepoList] = useState<Array<Repository> | undefined>(undefined);
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

    function getRepoList(username: string) {
        setRepoList(undefined);
        if (isFirstRender) {
            setIsFirstRender(false);
        }
        fetchUserRepositories({username, pageLimit: 100, page:1})
        .then(data => setRepoList(data));
    }

    return (
        <>
            <UserSearch searchTrigger={getRepoList} isFirstRender={isFirstRender} loading={repoList === undefined}/>
            {!isFirstRender && repoList && <RepositoryList repoList={repoList} />}
        </>
    );
}
