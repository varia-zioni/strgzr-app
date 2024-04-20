import { Repository } from '../../models/RepositoryModel';
import RepositoryList from './components/RepositoryList';
import UserSearch from './components/UserSearch';
import { useState } from 'react';

export default function MainView() {
    const [repoList, setRepoList] = useState<Array<Repository> | undefined>(undefined);
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

    function getRepoList(username: string) {
        setRepoList(undefined);
        if (isFirstRender) {
            setIsFirstRender(false);
        }
        fetch(
            `https://api.github.com/users/${username}/repos`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(async (data) => {
                const response = await data.json();
                if (response?.length > 0) {
                    setRepoList(response);
                } else {
                    setRepoList([]);
                }
            }).catch((_) => setRepoList([]));
    }

    return (
        <>
            <UserSearch searchTrigger={getRepoList} isFirstRender={isFirstRender} />
            {!isFirstRender && <RepositoryList repoList={repoList} />}
        </>
    );
}
