import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UserSearch from '../UserSearch';

describe('UserSearch', () => {
  it('renders UserSearch correctly', async () => {
    const spyOnSetUsernameInput = jest.fn();
    const spyOnTriggerMock = jest.fn();
    const { getByTestId } = render(
      <UserSearch
        usernameInput=""
        setUsernameInput={spyOnSetUsernameInput}
        searchTrigger={spyOnTriggerMock}
        isFirstRender={true}
        loading={false}
      />
    );

    fireEvent.changeText(getByTestId('search-bar'), 'username');
    await waitFor(() => expect(spyOnSetUsernameInput).toHaveBeenCalled());

    expect(getByTestId('user-search-view')).toBeTruthy();
    expect(getByTestId('search-bar')).toBeTruthy();
    expect(getByTestId('search-button')).toBeTruthy();

    fireEvent.press(getByTestId('search-button'));

    expect(spyOnTriggerMock).toHaveBeenCalled();
  });

  it('renders UserSearch with different image when isFirstRender is false', () => {
    const { getByTestId, queryByTestId } = render(
      <UserSearch
        usernameInput=""
        setUsernameInput={() => {}}
        searchTrigger={() => {}}
        isFirstRender={false}
        loading={false}
      />
    );

    expect(getByTestId('user-search-view')).toBeTruthy();
    expect(queryByTestId('appTitleSmall')).toBeTruthy();
    expect(queryByTestId('appTitle')).toBeNull();
  });
});
