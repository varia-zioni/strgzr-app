import { Card, Chip, Divider, Icon, Searchbar, Text } from "react-native-paper";
import { Repository } from "../../../models/RepositoryModel";
import React, { useState } from "react";
import { FlatList, TouchableHighlight, View } from "react-native";
import StargazersModal from "./StargazersModal";

const ItemCard = (({ repo }: { repo: Repository }) => {
    const [openModal, setOpenModal] = useState<boolean>(false);

    return (
        <>
            <Divider bold />
            <TouchableHighlight
                onLongPress={() => setOpenModal(true)}
                delayLongPress={200}
            >
                <Card style={{ borderRadius: 0, paddingRight: 10 }}>
                    <Card.Title
                        title={repo.name}
                        right={() =>
                            <Chip icon="star-circle-outline" onPress={() => setOpenModal(true)} style={{ width: 65 }}>
                                {repo.stargazers_count}
                            </Chip>
                        }
                    />
                </Card>
            </TouchableHighlight>
            <StargazersModal openModal={openModal} setOpenModal={setOpenModal} repo={repo} />
        </>
    );
})

export default function RepositoryList({ repoList }: { repoList: Array<Repository> }) {
    const [filteredRepoList, setFilteredRepoList] = useState<Array<Repository>>(repoList);
    const [filterText, setFilterText] = useState<string>("");

    function handleFilterList(textInput: string) {
        setFilterText(textInput);
        if (textInput.trim()) {
            setFilteredRepoList(repoList.filter(el => el.name.toLowerCase().includes(textInput.toLowerCase())));
        } else {
            setFilteredRepoList(repoList);
        }
    }

    return (
        <View style={{ height: "100%", paddingBottom: 30 }}>
            {
                repoList.length === 0 ?
                    <Text variant="displayLarge">
                        Nessuna repository trovata <Icon source="emoticon-sad-outline" size={50} />
                    </Text>
                    :
                    <View>
                        <Searchbar
                            value={filterText}
                            placeholder="Nome repository"
                            onChangeText={handleFilterList}
                            style={{ borderRadius: 0 }}
                        />
                        <FlatList
                            data={filteredRepoList}
                            renderItem={({ item }) => <ItemCard repo={item} />}
                            keyExtractor={item => item.id}
                        />
                    </View>
            }
        </View>)
}