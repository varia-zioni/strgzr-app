import Config from "react-native-config";
import { Repository } from "../models/RepositoryModel";

export function fetchUserRepositories({ username, pageLimit, page }: { username: string; pageLimit: number; page: number; }): Promise<Array<Repository>> {
    return fetch(
        `https://api.github.com/users/${username}}/repos?per_page=${pageLimit}&page=${page}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Beared ${Config.GIT_HUB_TOKEN}`
            }
        })
        .then(async (data) => {
            return data.json();
        })
        .catch((_) => Promise.resolve([]));
}