import { Repository } from '../../models/RepositoryModel';
import RepositoryList from './components/RepositoryList';
import UserSearch from './components/UserSearch';
import React, { useState } from 'react';
import { fetchUserRepositories } from '../../services/githubService';
import Config from 'react-native-config';

export default function MainView() {
    const [repoList, setRepoList] = useState<Array<Repository>>([]);
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [userInput, setUserInput] = useState<string>("");
    const [page, setPage] = useState<number>(1);

    function getRepoList(newPage: number) {
        setLoading(true);
        setPage(newPage);
        if (isFirstRender) {
            setIsFirstRender(false);
        }
        fetchUserRepositories({ username: userInput, pageLimit: 30, page: newPage ?? 1 })
            .then(async data => {
                const response = await data.json();
                setRepoList(response);
            })
            .catch(() => setRepoList([]))
            .finally(() => setLoading(false));
    }

    return (
        <>
            <UserSearch
                userInput={userInput}
                setUserInput={setUserInput}
                searchTrigger={() => getRepoList(0)}
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
                    userInput={userInput}
                    setLoading={setLoading}
                />
            }
        </>
    );
}
