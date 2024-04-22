import { Repository } from '../../models/RepositoryModel';
import RepositoryList from './components/RepositoryList';
import UserSearch from './components/UserSearch';
import React, { useRef, useState } from 'react';
import { fetchUserRepositories } from '../../services/githubService';
import { BackHandler, FlatList } from 'react-native';

export default function MainView() {
    const [repoList, setRepoList] = useState<Array<Repository>>([]);
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [usernameInput, setUsernameInput] = useState<string>("");
    const [page, setPage] = useState<number>(1);

    const flatListRef = useRef<FlatList>(null);

    function getRepoList(newPage: number) {
        if (usernameInput.trim()) {
            setLoading(true);
            setPage(newPage);
            let elementsFound = false;
            fetchUserRepositories({ username: usernameInput, pageLimit: 30, page: newPage || 1 })
                .then(async data => {
                    const response = await data.json();
                    setRepoList((prev: Array<Repository>) => (newPage === 1 ? response : prev.concat(response)));
                    elementsFound = response.length > 0;
                })
                .catch(() => setRepoList([]))
                .finally(() => {
                    setLoading(false);
                    if (isFirstRender) {
                        setIsFirstRender(false);
                    } else if (flatListRef?.current && newPage === 1 && elementsFound) {
                        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
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
                    getFirstPage={() => getRepoList(1)}
                    getNextPage={() => getRepoList(page + 1)}
                    loading={loading}
                    userInput={usernameInput}
                    flatListRef={flatListRef}
                />
            }
        </>
    );
}
