import { Portal, Card, Text, Modal, Divider, Icon, Avatar, ActivityIndicator } from "react-native-paper";
import { Repository } from "../../../models/RepositoryModel";
import { useEffect, useState } from "react";
import { Stargazer } from "../../../models/StargazerModel";
import { FlatList, View } from "react-native";
import { fetchRepositoryStargazers } from "../../../services/githubService";

const ItemCard = ({ user, index }: { user: Stargazer, index: number }) => (
    <>
        {index !== 0 && <Divider bold />}
        <Card style={{ borderRadius: 0, paddingRight: 10, backgroundColor: "#eddcf5" }}>
            <Card.Title
                titleStyle={{ color: "#000000" }}
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
    </>
)

type Props = {
    openModal: boolean;
    setOpenModal: (bool: boolean) => void;
    repo: Repository;
}

export default function StargazersModal({ openModal, setOpenModal, repo }: Props) {
    const [stargazersList, setStargazersList] = useState<Array<Stargazer> | undefined>(undefined);

    function getStargazers() {
        fetchRepositoryStargazers({ username: repo.owner.login, repoName: repo.name })
            .then(async (data) => {
                const response = await data.json();
                if (response?.length > 0) {
                    setStargazersList(response);
                } else {
                    setStargazersList([]);
                }
            })
            .catch((_) => setStargazersList([]))
    }

    useEffect(() => getStargazers(), []);

    return (
        <Portal>
            <Modal visible={openModal} onDismiss={() => setOpenModal(false)}>
                <Card style={{ marginHorizontal: 20, backgroundColor: "#eddcf5", maxHeight: 700 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", padding: 15 }}>
                        <Icon source="github" size={25} color="#000000" />
                        <Text variant="titleMedium" style={{ color: "#000000", marginLeft: 15 }}>{repo.full_name}</Text>
                    </View>
                    <Divider bold />
                    <View style={{ flexDirection: "row", justifyContent: "center", padding: 15 }}>
                        {
                            !stargazersList ?
                                <ActivityIndicator size="large" />
                                :
                                stargazersList.length === 0 ?
                                    <>
                                        <Text variant="bodyLarge" style={{ color: "#000000", marginRight: 10 }}>
                                            Non sono presenti stargazers
                                        </Text>
                                        <Icon source="emoticon-sad-outline" size={30} color="#000000" />
                                    </>
                                    :
                                    <FlatList
                                        style={{ maxHeight: 600 }}
                                        data={stargazersList}
                                        renderItem={({ item, index }) => <ItemCard user={item} index={index} />}
                                        keyExtractor={item => item.login}
                                    />
                        }
                    </View>
                </Card>
            </Modal>
        </Portal>
    )
}