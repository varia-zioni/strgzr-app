import { Card, Chip, Divider, Icon, Searchbar, Text } from "react-native-paper";
import { Repository } from "../../../models/RepositoryModel";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, TouchableHighlight, View } from "react-native";
import StargazersModal from "./StargazersModal";
import { fetchFilteredRepositories } from "../../../services/githubService";
import styles from "../../../utils/styleSheet";

const ItemCard = (({ repo }: { repo: Repository }) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    return (
        <>
            <Divider bold />
            <TouchableHighlight
                onLongPress={() => setOpenModal(true)}
                delayLongPress={200}
            >
                <Card style={{ borderRadius: 0, paddingRight: 10, backgroundColor: styles.colors.dark }}>
                    <Card.Title
                        title={repo.name}
                        right={() =>
                            <Chip icon="star-circle-outline" onPress={() => setOpenModal(true)} style={{ minWidth: 50 }}>
                                {repo.stargazers_count}
                            </Chip>
                        }
                    />
                </Card>
            </TouchableHighlight>
            {openModal && <StargazersModal openModal={openModal} setOpenModal={setOpenModal} repo={repo} />}
        </>
    );
});

const renderEmptyState = () => (
    <View style={{
        padding: 50,
        alignItems: 'center'
    }}>
        <Icon source="emoticon-sad-outline" size={50} />
        <Text variant="titleMedium" style={{ marginTop: 20 }}>
            Nessuna repository trovata
        </Text>

    </View>
);

type Props = {
    repoList: Array<Repository>;
    setRepoList: (array: Array<Repository>) => void;
    getFirstPage: () => void;
    getNextPage: () => void;
    getPreviousPage: () => void;
    loading: boolean;
    userInput: string;
};

const pageLimit = 30;
export default function RepositoryList({
    repoList,
    setRepoList,
    getFirstPage,
    getNextPage,
    getPreviousPage,
    loading,
    userInput
}: Props) {

    const [filterText, setFilterText] = useState<string | undefined>(undefined);
    const flatListRef = useRef<FlatList>(null);
    const [page, setPage] = useState<number>(1);
    const [filterLoading, setFilterLoading] = useState<boolean>(false);

    function handleFilterList(newPage: number) {
        if (newPage !== 0) {
            setFilterLoading(true);
            setPage(newPage);
            fetchFilteredRepositories({ username: userInput, repoFilter: filterText ?? "", page: newPage, pageLimit })
                .then(async data => {
                    const response = await data.json();
                    setRepoList(response.items);
                })
                .catch(() => setRepoList([]))
                .finally(() => setFilterLoading(false));
        }
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (filterText !== undefined) {
                if (filterText === "") {
                    getFirstPage();
                } else {
                    handleFilterList(1);
                }
            }
        }, 300);
        return () => {
            clearTimeout(timeoutId)
        }
    }, [filterText])

    useEffect(() => {
        if (repoList.length > 0 && flatListRef.current) {
            flatListRef.current.scrollToOffset({ animated: false, offset: 10 });
        }
    }, [repoList])

    function handleOnEndReached() {
        if (repoList.length === pageLimit) {
            if (filterText) {
                handleFilterList(page + 1);
            } else {
                getNextPage();
            }
        }
    }

    function handleOnTopReached() {
        if (repoList.length === pageLimit) {
            if (filterText) {
                handleFilterList(page - 1);
            } else {
                getPreviousPage();
            }
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: styles.colors.dark }} testID="repo-list-view">
            <Searchbar
                value={filterText ?? ""}
                placeholder="Nome repository"
                onChangeText={setFilterText}
                style={{ borderRadius: 0 }}
                loading={filterLoading}
                testID="repo-search-bar"
            />
            <FlatList
                testID="flatlist"
                ref={flatListRef}
                data={repoList}
                renderItem={({ item }) => <ItemCard repo={item} />}
                keyExtractor={item => (item.id + item.name)}
                onEndReached={() => handleOnEndReached()}
                refreshing={loading || filterLoading}
                ListEmptyComponent={renderEmptyState}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={() => handleOnTopReached()} colors={[styles.colors.strongPurple]} />
                }
            />
        </View>)
}