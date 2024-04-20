import { Portal, Card, Text, Modal, Divider, Icon, Avatar } from "react-native-paper";
import { Repository } from "../../../models/RepositoryModel";
import { useEffect, useState } from "react";
import { Stargazer } from "../../../models/StargazerModel";
import { FlatList, View } from "react-native";
import Config from "react-native-config";

const ItemCard = ({ user }: { user: Stargazer }) => (
    <>
        <Divider bold />
        <Card style={{ borderRadius: 0, paddingRight: 10 }}>
            <Card.Title
                title={user.login}
                left={() =>
                    <Avatar.Image size={24} source={{ uri: user.avatar_url }} />
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
        fetch(
            `https://api.github.com/repos/${repo.owner.login}/${repo.name}/stargazers`,
            {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization':  `Beared ${Config.GIT_HUB_TOKEN}`
                 }

            })
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
                <Card style={{ marginHorizontal: 20, backgroundColor: "#eddcf5", maxHeight: 500 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", padding: 15 }}>
                        <Icon source="github" size={25} color="#000000" />
                        <Text variant="titleMedium" style={{ color: "#000000", marginLeft: 15 }}>{repo.full_name}</Text>
                    </View>
                    <Divider bold />
                    <View style={{ flexDirection: "row", alignItems: "center", padding: 15 }}>
                        {
                            !stargazersList ? <></>
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
                                        style={{ maxHeight: 400 }}
                                        data={stargazersList}
                                        renderItem={({ item }) => <ItemCard user={item} />}
                                        keyExtractor={item => item.login}
                                    />

                        }
                    </View>
                </Card>
            </Modal>
        </Portal>
    )
}