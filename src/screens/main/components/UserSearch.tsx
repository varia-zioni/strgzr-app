import { Image, View } from "react-native";
import { ActivityIndicator, Button, Searchbar, Surface } from "react-native-paper";
import styles from "../../../utils/styleSheet";

type Props = {
    userInput: string;
    setUserInput: (username: string) => void;
    searchTrigger: () => void;
    isFirstRender: boolean;
    loading: boolean;
}

const baseImagePath = "../../../assets/";
export default function UserSearch({ userInput, setUserInput, searchTrigger, isFirstRender, loading }: Props) {

    return (
        <Surface
            elevation={4}
            style={{
                paddingHorizontal: 20,
                paddingVertical: 30,
                backgroundColor: styles.colors.lightPurple,
                height: isFirstRender ? "100%" : "auto",
                justifyContent: "center",
            }}
        >
            <View style={{ alignItems: "center" }}>
                {isFirstRender ?
                    <Image source={require(baseImagePath + "appTitle.png")} style={{ marginBottom: 50 }} />
                    :
                    <Image source={require(baseImagePath + "appTitleSmall.png")} style={{ marginBottom: 20 }} />
                }
            </View>
            <Searchbar
                icon="github"
                placeholder="Username GitHub"
                onChangeText={setUserInput}
                value={userInput}
                style={{ marginBottom: 20 }}
            />
            <Button mode="contained" onPress={() => searchTrigger()} style={{ height: 50, justifyContent: "center" }}>
                {loading ? <ActivityIndicator color={styles.colors.black} /> : "Recupera lista repository"}
            </Button>
        </Surface>
    );
}
