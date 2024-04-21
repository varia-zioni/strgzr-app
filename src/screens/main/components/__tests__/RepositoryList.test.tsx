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
        const { getByTestId } = render(
            <RepositoryList
                repoList={hundredRepoes().items}
                setRepoList={spyOnSetRepoList}
                getFirstPage={spyOnGetFirstPage}
                getNextPage={() => { }}
                getPreviousPage={() => { }}
                loading={false}
                userInput="testuser"
            />
        );

        fireEvent.changeText(getByTestId('repo-search-bar'), 'testFilter');
        await waitFor(() => expect(spyOnFetchFilteredRepo).toHaveBeenCalled());
        await waitFor(() => expect(spyOnSetRepoList).toHaveBeenCalled());

        fireEvent.changeText(getByTestId('repo-search-bar'), '');
        await waitFor(() => expect(spyOnGetFirstPage).toHaveBeenCalled());

        fireEvent(getByTestId('flatlist'), 'onEndReached');

        expect(getByTestId('repo-list-view')).toBeTruthy();
        expect(getByTestId('flatlist')).toBeTruthy();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
