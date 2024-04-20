import { useState } from "react";
import { ActivityIndicator, Button, Searchbar, Surface } from "react-native-paper";

type Props = {
    searchTrigger: (username: string) => void;
    isFirstRender: boolean;
    loading: boolean;
}

export default function UserSearch({ searchTrigger, isFirstRender, loading }: Props) {
    const [userInput, setUserInput] = useState<string>("");

    return (
        <Surface
            elevation={4}
            style={{
                paddingHorizontal: 20,
                paddingVertical: 30,
                backgroundColor: "#eddcf5",
                height: isFirstRender ? "100%" : "auto",
                justifyContent: "center",
            }}
        >
            <Searchbar
                icon="github"
                placeholder="Username GitHub"
                onChangeText={setUserInput}
                value={userInput}
                style={{ marginBottom: 20 }}
            />
            <Button mode="contained" onPress={() => searchTrigger(userInput)} style={{ height: 50, justifyContent: "center" }}>
                {loading ? <ActivityIndicator color="#000000" /> : "Recupera lista repository"}
            </Button>
        </Surface>
    );
}
