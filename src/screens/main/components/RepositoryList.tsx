import { ActivityIndicator, Card, Chip, Divider, Icon, Text } from "react-native-paper";
import { Repository } from "../../../models/RepositoryModel";
import React from "react";
import { FlatList } from "react-native";

const ItemCard = (({ repo }: { repo: Repository }) => {
    return (
        <>
            <Divider bold/>
            <Card style={{ borderRadius: 0, paddingRight: 10 }}>
                <Card.Title
                    title={repo.name}
                    subtitle={repo.description}
                    right={() => <Chip icon="star-circle-outline" onPress={() => { }}>{repo.stargazers_count}</Chip>}
                />
            </Card>
        </>

    );
})

export default function RepositoryList({ repoList }: { repoList: Array<Repository> | undefined }) {
    return (
        <>
            {repoList === undefined ?
                <ActivityIndicator size={"large"} /> :
                repoList.length === 0 ?
                    <Text variant="displayLarge">
                        Nessuna repository trovata <Icon source="emoticon-sad-outline" size={50} />
                    </Text>
                    :
                    <FlatList
                        data={repoList}
                        renderItem={({ item }) => <ItemCard repo={item} />}
                        keyExtractor={item => item.id}
                    />
            }
        </>)
}