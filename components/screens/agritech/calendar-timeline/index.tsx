import React from "react";
import { View, Text } from "react-native";
import { CropCalendarEntry, getCalendarCategoryColor } from "@/data/agritech";

interface CalendarTimelineProps {
  entries: CropCalendarEntry[];
}

const statusIcons: Record<CropCalendarEntry["status"], string> = {
  completed: "\u2705",
  "in-progress": "\ud83d\udd04",
  upcoming: "\ud83d\udcc5",
  overdue: "\u26a0\ufe0f",
};

const categoryIcons: Record<string, string> = {
  sowing: "\ud83c\udf31",
  irrigation: "\ud83d\udca7",
  fertilization: "\ud83e\udea4",
  "pest-control": "\ud83d\udc1b",
  harvest: "\ud83c\udf3e",
  "soil-prep": "\ud83d\udea7",
};

export default function CalendarTimeline({ entries }: CalendarTimelineProps) {
  return (
    <View>
      {entries.map((entry, index) => {
        const catColor = getCalendarCategoryColor(entry.category);
        const isLast = index === entries.length - 1;

        return (
          <View key={entry.id} className="flex-row">
            {/* Timeline line */}
            <View className="items-center w-8">
              <View
                className="w-4 h-4 rounded-full items-center justify-center z-10"
                style={{
                  backgroundColor:
                    entry.status === "completed" ? "#22c55e" :
                    entry.status === "in-progress" ? "#3b82f6" :
                    entry.status === "overdue" ? "#ef4444" : "#d4d4d4",
                }}
              >
                <View className="w-2 h-2 rounded-full bg-white" />
              </View>
              {!isLast && (
                <View
                  className="w-0.5 flex-1"
                  style={{
                    backgroundColor:
                      entry.status === "completed" ? "#22c55e50" : "#d4d4d450",
                  }}
                />
              )}
            </View>

            {/* Content */}
            <View className="flex-1 pb-4 ml-2">
              <View
                className="rounded-xl p-3 border"
                style={{
                  backgroundColor: catColor + "08",
                  borderColor: catColor + "25",
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <Text style={{ fontSize: 16 }}>
                      {categoryIcons[entry.category] || "\ud83d\udcc5"}
                    </Text>
                    <Text
                      className="text-typography-900 font-dm-sans-bold text-sm ml-2 flex-1"
                      numberOfLines={1}
                    >
                      {entry.activity}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14 }}>{statusIcons[entry.status]}</Text>
                </View>
                <Text className="text-typography-500 text-xs font-dm-sans-regular mt-1">
                  {new Date(entry.startDate).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(entry.endDate).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <Text
                  className="text-typography-600 text-xs font-dm-sans-regular mt-1 leading-4"
                  numberOfLines={2}
                >
                  {entry.notes}
                </Text>
                <View
                  className="self-start rounded-full px-2 py-0.5 mt-2"
                  style={{ backgroundColor: catColor + "20" }}
                >
                  <Text className="text-xs font-dm-sans-medium capitalize" style={{ color: catColor }}>
                    {entry.category.replace("-", " ")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
