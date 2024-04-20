import { useState } from "react";
import { View } from "react-native";
import { Button, Searchbar, Surface } from "react-native-paper";

export default function UserSearch({ searchTrigger, isFirstRender }: { searchTrigger: (username: string) => void; isFirstRender: boolean; }) {
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
                placeholder="GitHub username"
                onChangeText={setUserInput}
                value={userInput}
                style={{ marginBottom: 20 }}
            />
            <View>
                <Button mode="contained" onPress={() => searchTrigger(userInput)}>
                    Recupera lista repository
                </Button>
            </View>

        </Surface>
    );
}
