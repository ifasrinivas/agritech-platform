// Web: stub that provides null components
import React from "react";
import { View } from "react-native";

const MapView = React.forwardRef((props: any, ref: any) => (
  <View ref={ref} style={[{ flex: 1, backgroundColor: "#0f1a12" }, props.style]}>
    {props.children}
  </View>
));
MapView.displayName = "MapViewWeb";

const Marker = (_props: any) => null;
const Polygon = (_props: any) => null;
const PROVIDER_GOOGLE = undefined;

export { Marker, Polygon, PROVIDER_GOOGLE };
export type MapPressEvent = any;
export type Region = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };
export const HAS_MAPS = false;
export default MapView;
