import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

interface Course {
  id: string;
  title: string;
  provider: string;
  modules: number;
  completed: number;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  certificate: boolean;
  icon: string;
  color: string;
}

const courses: Course[] = [
  { id: "c1", title: "Precision Agriculture Fundamentals", provider: "ICAR e-Courses", modules: 12, completed: 12, duration: "6 hrs", level: "beginner", category: "Technology", certificate: true, icon: "\ud83d\udef0\ufe0f", color: "#8b5cf6" },
  { id: "c2", title: "Integrated Pest Management (IPM)", provider: "MANAGE Hyderabad", modules: 8, completed: 8, duration: "4 hrs", level: "intermediate", category: "Crop Protection", certificate: true, icon: "\ud83d\udc1b", color: "#ef4444" },
  { id: "c3", title: "Drip Irrigation Design & Management", provider: "Jain Irrigation Academy", modules: 10, completed: 7, duration: "5 hrs", level: "intermediate", category: "Water Management", certificate: true, icon: "\ud83d\udca7", color: "#3b82f6" },
  { id: "c4", title: "Organic Farming Certification Prep", provider: "NPOP Training Portal", modules: 15, completed: 4, duration: "8 hrs", level: "intermediate", category: "Organic", certificate: true, icon: "\ud83c\udf3f", color: "#22c55e" },
  { id: "c5", title: "Export Quality Standards - Fresh Produce", provider: "APEDA", modules: 6, completed: 6, duration: "3 hrs", level: "advanced", category: "Export", certificate: true, icon: "\ud83d\udce6", color: "#f59e0b" },
  { id: "c6", title: "Drone Operation for Agriculture", provider: "DGCA / AgriDrone Academy", modules: 8, completed: 2, duration: "10 hrs (incl. practical)", level: "advanced", category: "Technology", certificate: true, icon: "\ud83d\ude81", color: "#7c3aed" },
  { id: "c7", title: "Soil Health & Carbon Farming", provider: "FAO e-Learning", modules: 10, completed: 0, duration: "5 hrs", level: "beginner", category: "Soil", certificate: true, icon: "\ud83e\udea8", color: "#06b6d4" },
  { id: "c8", title: "Farm Financial Management", provider: "NABARD Training", modules: 6, completed: 0, duration: "3 hrs", level: "beginner", category: "Finance", certificate: false, icon: "\ud83d\udcb0", color: "#f97316" },
];

const levelColors = { beginner: "#22c55e", intermediate: "#3b82f6", advanced: "#8b5cf6" };

export default function TrainingScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");

  const completedCourses = courses.filter((c) => c.completed === c.modules).length;
  const inProgressCourses = courses.filter((c) => c.completed > 0 && c.completed < c.modules).length;
  const totalCertificates = courses.filter((c) => c.completed === c.modules && c.certificate).length;

  const filtered = filter === "all" ? courses :
    filter === "completed" ? courses.filter((c) => c.completed === c.modules) :
    filter === "in-progress" ? courses.filter((c) => c.completed > 0 && c.completed < c.modules) :
    courses.filter((c) => c.completed === 0);

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View>
          <Text className="text-typography-900 text-lg font-dm-sans-bold">{"\ud83c\udf93"} Training Center</Text>
          <Text className="text-typography-400 text-xs">Courses, certifications & skill building</Text>
        </View>
      </View>

      {/* Stats */}
      <View className="flex-row mx-5 mt-3 gap-2 mb-3">
        <View className="flex-1 bg-green-50 rounded-xl p-2.5 items-center border border-green-200">
          <Text className="text-green-800 text-lg font-dm-sans-bold">{completedCourses}</Text>
          <Text className="text-green-600 text-xs">Completed</Text>
        </View>
        <View className="flex-1 bg-blue-50 rounded-xl p-2.5 items-center border border-blue-200">
          <Text className="text-blue-800 text-lg font-dm-sans-bold">{inProgressCourses}</Text>
          <Text className="text-blue-600 text-xs">In Progress</Text>
        </View>
        <View className="flex-1 bg-yellow-50 rounded-xl p-2.5 items-center border border-yellow-200">
          <Text className="text-yellow-800 text-lg font-dm-sans-bold">{totalCertificates}</Text>
          <Text className="text-yellow-600 text-xs">Certificates</Text>
        </View>
      </View>

      {/* Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-10 mx-5 mb-3">
        {[
          { key: "all", label: "All" },
          { key: "in-progress", label: "\ud83d\udd04 In Progress" },
          { key: "completed", label: "\u2705 Completed" },
          { key: "new", label: "\u2b50 New" },
        ].map((f) => (
          <Pressable key={f.key} className="rounded-xl px-4 py-2 mr-2" style={filter === f.key ? { backgroundColor: "#16a34a" } : { backgroundColor: "#f3f4f6" }} onPress={() => setFilter(f.key)}>
            <Text className={`text-xs font-dm-sans-medium ${filter === f.key ? "text-white" : "text-typography-500"}`}>{f.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        <View className="px-5">
          {filtered.map((course) => {
            const progress = course.modules > 0 ? (course.completed / course.modules) * 100 : 0;
            const isComplete = course.completed === course.modules;
            const isStarted = course.completed > 0;

            return (
              <View key={course.id} className="bg-background-50 rounded-2xl overflow-hidden mb-3 border border-outline-100">
                {/* Progress bar at top */}
                {isStarted && (
                  <View className="h-1" style={{ backgroundColor: course.color + "20" }}>
                    <View className="h-full" style={{ width: `${progress}%`, backgroundColor: course.color }} />
                  </View>
                )}

                <View className="p-4">
                  <View className="flex-row items-start">
                    <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: course.color + "15" }}>
                      <Text style={{ fontSize: 24 }}>{course.icon}</Text>
                    </View>
                    <View className="flex-1 ml-3">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm">{course.title}</Text>
                      <Text className="text-typography-500 text-xs">{course.provider}</Text>
                      <View className="flex-row items-center mt-1.5 gap-2">
                        <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: levelColors[course.level] + "15" }}>
                          <Text className="capitalize" style={{ fontSize: 9, color: levelColors[course.level] }}>{course.level}</Text>
                        </View>
                        <Text className="text-typography-400 text-xs">{course.duration}</Text>
                        <Text className="text-typography-400 text-xs">{course.modules} modules</Text>
                        {course.certificate && <Text style={{ fontSize: 10 }}>{"\ud83c\udfc5"}</Text>}
                      </View>
                    </View>
                  </View>

                  {/* Progress */}
                  {isStarted && (
                    <View className="mt-3">
                      <View className="flex-row justify-between mb-1">
                        <Text className="text-typography-500 text-xs">
                          {isComplete ? "\u2705 Completed!" : `${course.completed}/${course.modules} modules`}
                        </Text>
                        <Text className="text-xs font-dm-sans-bold" style={{ color: course.color }}>{progress.toFixed(0)}%</Text>
                      </View>
                      <View className="h-2 bg-background-200 rounded-full overflow-hidden">
                        <View className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: course.color }} />
                      </View>
                    </View>
                  )}

                  {/* Action */}
                  <Pressable
                    className="rounded-xl py-2.5 items-center mt-3"
                    style={{ backgroundColor: isComplete ? "#f3f4f6" : course.color }}
                  >
                    <Text className={`text-xs font-dm-sans-bold ${isComplete ? "text-typography-600" : "text-white"}`}>
                      {isComplete ? "\ud83c\udfc5 View Certificate" : isStarted ? "\u25b6\ufe0f Continue Learning" : "\ud83c\udf93 Start Course"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

        {/* Skills Earned */}
        <View className="mx-5 mt-2 bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
          <Text className="text-yellow-800 font-dm-sans-bold text-sm mb-2">{"\ud83c\udfc6"} Skills Earned</Text>
          <View className="flex-row flex-wrap gap-2">
            {["Precision Farming", "IPM Certified", "Export Standards", "Satellite Analysis", "Drone Basics"].map((skill, i) => (
              <View key={i} className="bg-white rounded-full px-3 py-1 border border-yellow-200">
                <Text className="text-yellow-800 text-xs font-dm-sans-medium">{"\u2705"} {skill}</Text>
              </View>
            ))}
            {["Organic Cert.", "Drone License", "Carbon Accounting", "Financial Mgmt"].map((skill, i) => (
              <View key={i} className="bg-white/50 rounded-full px-3 py-1 border border-yellow-100">
                <Text className="text-yellow-600/60 text-xs font-dm-sans-medium">{"\ud83d\udd12"} {skill}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
