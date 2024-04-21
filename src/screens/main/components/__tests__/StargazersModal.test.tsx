import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import StargazersModal from '../StargazersModal';
import * as githubService from '../../../../services/githubService';

const spyOnFetchRepositoryStargazers = jest.spyOn(githubService, 'fetchRepositoryStargazers');

const stargazersListMock = [
    { id: 1, login: 'user1', avatar_url: 'avatar_url_1', html_url: 'html_url_1' },
    { id: 2, login: 'user2', avatar_url: 'avatar_url_2', html_url: 'html_url_2' },
];
// @ts-ignore
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(stargazersListMock),
    })
);

const repo = {
    id: 1,
    name: `repo1`,
    description: '',
    stargazers_url: '',
    stargazers_count: '',
    full_name: '',
    owner: {
        login: ''
    }
};

describe('StargazersModal', () => {
    it('renders StargazersModal correctly', async () => {
        const setOpenModalMock = jest.fn();
        const { getByTestId } = render(
            <StargazersModal
                openModal={true}
                setOpenModal={setOpenModalMock}
                repo={repo}
            />
        );

        await waitFor(() => expect(spyOnFetchRepositoryStargazers).toHaveBeenCalled());

        expect(getByTestId('stargazers-modal')).toBeTruthy();
        expect(getByTestId('close-button')).toBeTruthy();
        expect(getByTestId('flatlist')).toBeTruthy();

        fireEvent.press(getByTestId('close-button'));

        expect(setOpenModalMock).toHaveBeenCalledWith(false);
    });
});
