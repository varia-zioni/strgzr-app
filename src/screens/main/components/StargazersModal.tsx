import { Card, Text, Divider, Icon, Avatar, ActivityIndicator, IconButton } from "react-native-paper";
import { Repository } from "../../../models/RepositoryModel";
import { useEffect, useState } from "react";
import { Stargazer } from "../../../models/StargazerModel";
import { FlatList, View, Modal, RefreshControl, TouchableHighlight, Linking } from "react-native";
import { fetchRepositoryStargazers } from "../../../services/githubService";
import styles from "../../../utils/styleSheet";

const ItemCard = ({ user, index }: { user: Stargazer, index: number }) => (
    <>
        {index !== 0 && <Divider bold />}
        <TouchableHighlight
            onPress={() => Linking.openURL(user.html_url)}
        >
            <Card style={{ borderRadius: 0, paddingRight: 10, backgroundColor: styles.colors.lightPurple }}>
                <Card.Title
                    titleStyle={{ color: styles.colors.black }}
                    title={user.login}
                    left={() =>
                        <View style={{
                            height: 35,
                            width: 35,
                            borderRadius: 50,
                            backgroundColor: "white",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Avatar.Image size={24} source={{ uri: user.avatar_url }} />
                        </View>
                    }
                />
            </Card>
        </TouchableHighlight>
    </>
)

type Props = {
    openModal: boolean;
    setOpenModal: (bool: boolean) => void;
    repo: Repository;
}

export default function StargazersModal({ openModal, setOpenModal, repo }: Props) {
    const [stargazersList, setStargazersList] = useState<Array<Stargazer> | undefined>(undefined);
    const [page, setPage] = useState<number>(1);
    const [nextPageLoading, setNextPageLoading] = useState<boolean>(false);

    function getStargazers(newPage: number) {
        setNextPageLoading(true);
        setPage(newPage);
        fetchRepositoryStargazers({ username: repo.owner.login, repoName: repo.name, pageNum: newPage })
            .then(async (data) => {
                const response = await data.json();
                setStargazersList((prev) => prev ? prev.concat(response) : response);
            })
            .finally(() => setNextPageLoading(false));
    }

    useEffect(() => getStargazers(1), []);

    return (
        <Modal
            animationType="fade"
            visible={openModal}
            onRequestClose={() => setOpenModal(false)}
            transparent
            presentationStyle="overFullScreen"
        >
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Card style={{ marginHorizontal: 20, backgroundColor: styles.colors.lightPurple, maxHeight: 700, width: 350 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 15, paddingLeft: 15 }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Icon source="github" size={25} color={styles.colors.black} />
                            <Text variant="titleMedium" style={{ color: styles.colors.black, marginLeft: 15, paddingRight: 20 }} >{repo.name}</Text>
                        </View>
                        <IconButton icon="close" iconColor={styles.colors.black} size={25} onPress={() => setOpenModal(false)} />
                    </View>
                    <Divider bold />
                    <View style={{ flexDirection: "row", justifyContent: "center", padding: 15 }}>
                        {
                            !stargazersList ?
                                <ActivityIndicator size="large" />
                                :
                                <FlatList
                                    style={{ maxHeight: 600 }}
                                    data={stargazersList}
                                    renderItem={({ item, index }) => <ItemCard user={item} index={index} />}
                                    keyExtractor={item => item.login}
                                    onEndReached={() => getStargazers(page + 1)}
                                    onEndReachedThreshold={20}
                                    ListEmptyComponent={() => (
                                        <>
                                            <Text variant="bodyLarge" style={{ color: styles.colors.black, marginRight: 10 }}>
                                                Non sono presenti stargazers
                                            </Text>
                                            <Icon source="emoticon-sad-outline" size={30} color={styles.colors.black} />
                                        </>
                                    )}
                                    refreshControl={
                                        <RefreshControl refreshing={nextPageLoading} colors={[styles.colors.strongPurple]} />
                                    }
                                />
                        }
                    </View>
                </Card>
            </View>
        </Modal>

    )
}