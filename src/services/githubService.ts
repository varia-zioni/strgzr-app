import Config from "react-native-config";

export function fetchUserRepositories({ username, pageLimit, page }: { username: string; pageLimit: number; page: number; }) {
    return fetch(
        `https://api.github.com/users/${username}/repos?per_page=${pageLimit}&page=${page}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Config.GIT_HUB_TOKEN}`
            }
        });
}

export function fetchFilteredRepositories({ username, repoFilter, page, pageLimit }: { username: string; repoFilter: string; page: number; pageLimit: number;}) {
    return fetch(
        `https://api.github.com/search/repositories?per_page=${pageLimit}&page=${page}&q=${encodeURIComponent(`${repoFilter} in:name user:${username}`)}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Config.GIT_HUB_TOKEN}`
            }
        });
}

export function fetchRepositoryStargazers({ username, repoName }: { username: string; repoName: string; }) {
    return  fetch(
        `https://api.github.com/repos/${username}/${repoName}/stargazers?per_page=100`,
        {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization':  `Bearer ${Config.GIT_HUB_TOKEN}`
             }

        });
}