import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import * as githubService from '../../../services/githubService';
import MainView from '../MainScreen';

const spyOnFetchUserRepo = jest.spyOn(githubService, 'fetchUserRepositories');

const mockResponseData = [
    { id: 1, name: 'repo1' },
    { id: 2, name: 'repo2' },
];

// @ts-ignore
global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockResponseData),
    })
  );

describe('MainView', () => {
    it('renders UserSearch when isFirstRender is true', () => {
        const { getByTestId, queryByTestId } = render(<MainView />);
        expect(getByTestId('user-search-view')).toBeTruthy();
        expect(queryByTestId('repo-list-view')).toBeFalsy();
    });

    it('renders RepositoryList when isFirstRender is false', async () => {
        const { getByTestId } = render(<MainView />);
        fireEvent.changeText(getByTestId('search-bar'), 'testuser');
        fireEvent.press(getByTestId('search-button'));

        await waitFor(() => expect(spyOnFetchUserRepo).toHaveBeenCalledWith({
            page: 1,
            username: 'testuser',
            pageLimit: 30
        }));
        await waitFor(() => expect(getByTestId('repo-list-view')).toBeTruthy());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});