import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable, View, Platform, Text } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LayoutDashboard, Map, ScanLine, BarChart3, User } from "lucide-react-native";
import { tapLight } from "@/services/haptics";

const ACTIVE_COLOR = "#059669";
const INACTIVE_COLOR = "#94a3b8";

interface TabItem {
  name: string;
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
}

const tabItems: TabItem[] = [
  { name: "(dashboard)", label: "Home", path: "(dashboard)", icon: LayoutDashboard },
  { name: "fields", label: "Fields", path: "fields", icon: Map },
  { name: "scan", label: "Scan", path: "scan", icon: ScanLine },
  { name: "insights", label: "Insights", path: "insights", icon: BarChart3 },
  { name: "profile", label: "Profile", path: "profile", icon: User },
];

function BottomTabBar(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          paddingTop: 8,
          paddingHorizontal: 8,
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 10,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        {tabItems.map((item) => {
          const isActive = props.state.routeNames[props.state.index] === item.path;
          const IconComponent = item.icon;

          return (
            <Pressable
              key={item.name}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 6,
              }}
              onPress={() => { tapLight(); props.navigation.navigate(item.path); }}
            >
              <View style={{ alignItems: "center", position: "relative" }}>
                {/* Active pill */}
                {isActive && (
                  <View
                    style={{
                      position: "absolute",
                      top: -2,
                      width: 48,
                      height: 32,
                      borderRadius: 10,
                      backgroundColor: ACTIVE_COLOR + "10",
                    }}
                  />
                )}
                <IconComponent
                  size={21}
                  color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
                  strokeWidth={isActive ? 2.3 : 1.7}
                />
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 10,
                    fontFamily: isActive ? "dm-sans-bold" : "dm-sans-medium",
                    color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR,
                    letterSpacing: 0.2,
                  }}
                >
                  {item.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default BottomTabBar;
