import { Repository } from '../../models/RepositoryModel';
import RepositoryList from './components/RepositoryList';
import UserSearch from './components/UserSearch';
import React, { useState } from 'react';
import { fetchUserRepositories } from '../../services/githubService';
import { BackHandler } from 'react-native';

export default function MainView() {
    const [repoList, setRepoList] = useState<Array<Repository>>([]);
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [usernameInput, setUsernameInput] = useState<string>("");
    const [page, setPage] = useState<number>(1);

    function getRepoList(newPage: number) {
        if(usernameInput.trim()){
            setLoading(true);
            setPage(newPage);
            fetchUserRepositories({ username: usernameInput, pageLimit: 30, page: newPage ?? 1 })
                .then(async data => {
                    const response = await data.json();
                    setRepoList(response);
                })
                .catch(() => setRepoList([]))
                .finally(() => {
                    setLoading(false);
                    if (isFirstRender) {
                        setIsFirstRender(false);
                    }
                });
        }
    }

    BackHandler.addEventListener('hardwareBackPress', function () {
        setIsFirstRender(true); 
        return true;
    });

    return (
        <>
            <UserSearch
                usernameInput={usernameInput}
                setUsernameInput={setUsernameInput}
                searchTrigger={() => getRepoList(1)}
                isFirstRender={isFirstRender}
                loading={loading}
            />
            {
                !isFirstRender &&
                <RepositoryList
                    repoList={repoList}
                    setRepoList={setRepoList}
                    getFirstPage={() => getRepoList(0)}
                    getNextPage={() => getRepoList(page + 1)}
                    getPreviousPage={() => page > 1 && getRepoList(page - 1)}
                    loading={loading}
                    userInput={usernameInput}
                />
            }
        </>
    );
}
