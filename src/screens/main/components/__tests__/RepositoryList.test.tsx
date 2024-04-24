import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RepositoryList from '../RepositoryList';
import * as githubService from '../../../../services/githubService';
import { Repository } from '../../../../models/RepositoryModel';

const spyOnFetchFilteredRepo = jest.spyOn(githubService, 'fetchFilteredRepositories');

const hundredRepoes = () => {
    const arr: Array<Repository> = [];
    for (let i = 0; i < 100; i++) {
        arr.push({
            id: i,
            name: `repo${i}`,
            description: '',
            stargazers_url: '',
            stargazers_count: '',
            full_name: '',
            owner: {
                login: ''
            }
        });
    }

    return { items: arr };
};

// @ts-ignore
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(hundredRepoes()),
    })
);

describe('RepositoryList', () => {
    it('renders RepositoryList correctly', async () => {
        const spyOnSetRepoList = jest.fn();
        const spyOnGetFirstPage = jest.fn();
        const { getByTestId, queryByTestId } = render(
            <RepositoryList
                repoList={hundredRepoes().items}
                setRepoList={spyOnSetRepoList}
                getFirstPage={spyOnGetFirstPage}
                getNextPage={() => { }}
                loading={false}
                userInput="testuser"
            />
        );
        expect(queryByTestId("empty-state")).toBeNull();

        fireEvent.changeText(getByTestId('repo-search-bar'), 'testFilter');
        await waitFor(() => expect(spyOnFetchFilteredRepo).toHaveBeenCalled());
        await waitFor(() => expect(spyOnSetRepoList).toHaveBeenCalled());

        fireEvent.changeText(getByTestId('repo-search-bar'), '');
        await waitFor(() => expect(spyOnGetFirstPage).toHaveBeenCalled());

        expect(getByTestId('repo-list-view')).toBeTruthy();
        expect(getByTestId('flatlist')).toBeTruthy();
    });

    it('renders RepositoryList empty state correctly', async () => {
        const spyOnSetRepoList = jest.fn();
        const spyOnGetFirstPage = jest.fn();
        const { getByTestId, queryByTestId } = render(
            <RepositoryList
                repoList={[]}
                setRepoList={spyOnSetRepoList}
                getFirstPage={spyOnGetFirstPage}
                getNextPage={() => { }}
                loading={false}
                userInput="testuser"
            />
        );

        expect(queryByTestId("empty-state")).not.toBeNull();
        expect(getByTestId('repo-list-view')).toBeTruthy();
    });

    it('renders RepositoryList and test open stargazers modal', async () => {
        const spyOnSetRepoList = jest.fn();
        const spyOnGetFirstPage = jest.fn();
        const { getByTestId, queryByTestId } = render(
            <RepositoryList
                repoList={[{
                    id: 1,
                    name: "repo1",
                    description: '',
                    stargazers_url: '',
                    stargazers_count: '',
                    full_name: '',
                    owner: {
                        login: ''
                    }
                }]}
                setRepoList={spyOnSetRepoList}
                getFirstPage={spyOnGetFirstPage}
                getNextPage={() => { }}
                loading={false}
                userInput="testuser"
            />
        );
        expect(queryByTestId("empty-state")).toBeNull();
        fireEvent.press(getByTestId("stargazers-chip"));

        await waitFor(() => {
            expect(getByTestId("stargazers-modal")).toBeTruthy();
        })
    });
});
