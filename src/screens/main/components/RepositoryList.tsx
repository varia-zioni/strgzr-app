import { Card, Chip, Divider, Icon, Searchbar, Text } from "react-native-paper";
import { Repository } from "../../../models/RepositoryModel";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import StargazersModal from "./StargazersModal";
import { fetchFilteredRepositories } from "../../../services/githubService";
import styles from "../../../utils/styleSheet";

const ItemCard = (({ repo }: { repo: Repository }) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    return (
        <>
            <Divider bold />
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
            {openModal && <StargazersModal openModal={openModal} setOpenModal={setOpenModal} repo={repo} />}
        </>
    );
});

const renderEmptyState = () => (
    <View style={{
        padding: 50,
        alignItems: 'center'
    }}
    testID="empty-state"
    >
        <Icon source="emoticon-sad-outline" size={50} />
        <Text variant="titleMedium" style={{ marginTop: 20 }}>
            Nessuna repository trovata
        </Text>

    </View>
);

type Props = {
    repoList: Array<Repository>;
    setRepoList: (arg: any) => void;
    getFirstPage: () => void;
    getNextPage: () => void;
    loading: boolean;
    userInput: string;
    flatListRef?: React.RefObject<FlatList<any>>;
};

const pageLimit = 30;
export default function RepositoryList({
    repoList,
    setRepoList,
    getFirstPage,
    getNextPage,
    loading,
    userInput,
    flatListRef
}: Props) {

    const [filterText, setFilterText] = useState<string | undefined>(undefined);

    const [page, setPage] = useState<number>(1);
    const [filterLoading, setFilterLoading] = useState<boolean>(false);

    function handleFilterList(newPage: number) {
        setFilterLoading(true);
        setPage(newPage);
        let elementsFound = false;
        fetchFilteredRepositories({ username: userInput, repoFilter: filterText ?? "", page: newPage, pageLimit })
            .then(async data => {
                const response = await data.json();
                setRepoList((prev: Array<Repository>) => (newPage === 1 ? response.items : prev.concat(response.items)));
                elementsFound = response.items.length > 0
            })
            .catch(() => setRepoList([]))
            .finally(() => {
                setFilterLoading(false);
                if (flatListRef?.current && newPage === 1 && elementsFound) {
                    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
                }
            });
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


    function handleOnEndReached() {
        if (repoList.length >= pageLimit) {
            if (filterText) {
                handleFilterList(page + 1);
            } else {
                getNextPage();
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
            />
        </View>)
}