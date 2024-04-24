import { Image, View } from "react-native";
import { ActivityIndicator, Button, Searchbar, Surface } from "react-native-paper";
import styles from "../../../utils/styleSheet";
import { testProps } from "../../../utils/testUtils";

type Props = {
    usernameInput: string;
    setUsernameInput: (username: string) => void;
    searchTrigger: () => void;
    isFirstRender: boolean;
    loading: boolean;
}

const baseImagePath = "../../../assets/";
export default function UserSearch({ usernameInput, setUsernameInput, searchTrigger, isFirstRender, loading }: Props) {

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
            {...testProps("user-search-view")}
        >
            <View style={{ alignItems: "center" }}>
                {isFirstRender ?
                    <Image {...testProps("appTitle")} source={require(baseImagePath + "appTitle.png")} style={{ marginBottom: 50 }} />
                    :
                    <Image {...testProps("appTitleSmall")} source={require(baseImagePath + "appTitleSmall.png")} style={{ marginBottom: 20 }} />
                }
            </View>
            <Searchbar
                icon="github"
                placeholder="Username GitHub"
                onChangeText={setUsernameInput}
                value={usernameInput}
                style={{ marginBottom: 20 }}
                {...testProps("search-bar")}
            />
            <Button mode="contained" onPress={() => searchTrigger()} style={{ height: 50, justifyContent: "center" }} {...testProps("search-button")}>
                {loading ? <ActivityIndicator color={styles.colors.black} /> : "Recupera lista repository"}
            </Button>
        </Surface>
    );
}
