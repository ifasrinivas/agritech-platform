import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

type CommunityTab = "feed" | "experts" | "groups" | "events";

interface Post {
  id: string;
  author: string;
  avatar: string;
  location: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  tags: string[];
  isExpert: boolean;
}

interface Expert {
  id: string;
  name: string;
  title: string;
  speciality: string;
  rating: number;
  consultations: number;
  avatar: string;
  available: boolean;
  fee: string;
}

const feed: Post[] = [
  {
    id: "p1", author: "Dr. Priya Sharma", avatar: "\ud83d\udc69\u200d\ud83c\udf93", location: "ICAR Nashik",
    timestamp: "2 hours ago", isExpert: true,
    content: "Heavy rainfall predicted for Sat-Sun in Western Maharashtra. Critical advisory for grape farmers: Harvest ready bunches BEFORE Saturday. For tomato growers: Apply preventive Mancozeb spray TODAY. Keep drainage channels clear.",
    likes: 145, comments: 23, tags: ["Weather Alert", "Grape", "Tomato"],
  },
  {
    id: "p2", author: "Suresh Patil", avatar: "\ud83d\udc68\u200d\ud83c\udf3e", location: "Nashik",
    timestamp: "5 hours ago", isExpert: false,
    content: "Has anyone tried Trichoderma viride for Early Blight in Tomato? My agronomist recommended it but I've always used Mancozeb. Looking for real field experience before switching to organic control.",
    likes: 32, comments: 18, tags: ["Tomato", "Organic", "Disease Control"],
  },
  {
    id: "p3", author: "AgriTech AI", avatar: "\ud83e\udde0", location: "System",
    timestamp: "6 hours ago", isExpert: true,
    content: "Market Intelligence Update: Onion prices at Lasalgaon APMC hit \u20b92,600/qtl (+12.4%). Export demand from Bangladesh and UAE driving prices. Rabi onion arrivals delayed by 2 weeks. AI prediction: prices may reach \u20b93,200/qtl in 30 days.",
    likes: 89, comments: 12, tags: ["Market", "Onion", "Price Alert"],
  },
  {
    id: "p4", author: "Anita Deshmukh", avatar: "\ud83d\udc69\u200d\ud83c\udf3e", location: "Pune District",
    timestamp: "8 hours ago", isExpert: false,
    content: "Sharing my experience with drip fertigation on Capsicum in polyhouse. Switched from manual fertilization to automated 19:19:19 through drip last season. Results: 22% higher yield, 35% water savings, and much more uniform fruit size. Happy to share my schedule with anyone interested.",
    likes: 67, comments: 31, tags: ["Capsicum", "Drip", "Greenhouse", "Success Story"],
  },
  {
    id: "p5", author: "Kisan Seva Kendra", avatar: "\ud83c\udfe2", location: "Nashik",
    timestamp: "1 day ago", isExpert: true,
    content: "Reminder: Last date for PMFBY Kharif 2026 enrollment is July 31. All farmers with crop loans are automatically covered. Non-loanee farmers can apply at CSC centers or through bank. Documents: Aadhaar, land records, bank passbook.",
    likes: 112, comments: 8, tags: ["Insurance", "Government", "PMFBY"],
  },
  {
    id: "p6", author: "Vijay Kulkarni", avatar: "\ud83d\udc68\u200d\ud83c\udf3e", location: "Sinnar, Nashik",
    timestamp: "1 day ago", isExpert: false,
    content: "Fall Armyworm alert in my Wheat field! Found larvae in the whorl. Used the AgriTech AI scanner - identified it at 91% confidence. Applied Emamectin Benzoate same day. Checked after 3 days - problem controlled. This app literally saved my crop. \ud83d\ude4f",
    likes: 203, comments: 42, tags: ["Pest Alert", "Wheat", "FAW", "App Review"],
  },
];

const experts: Expert[] = [
  { id: "e1", name: "Dr. Priya Sharma", title: "Plant Pathologist", speciality: "Disease management in vegetables & fruits", rating: 4.9, consultations: 450, avatar: "\ud83d\udc69\u200d\ud83c\udf93", available: true, fee: "\u20b9200/session" },
  { id: "e2", name: "Prof. R.K. Singh", title: "Soil Scientist", speciality: "Soil health, nutrient management & organic farming", rating: 4.8, consultations: 320, avatar: "\ud83d\udc68\u200d\ud83c\udf93", available: true, fee: "\u20b9250/session" },
  { id: "e3", name: "Dr. Meena Iyer", title: "Entomologist", speciality: "IPM, biological pest control & organic methods", rating: 4.9, consultations: 280, avatar: "\ud83d\udc69\u200d\ud83d\udd2c", available: false, fee: "\u20b9200/session" },
  { id: "e4", name: "Amit Joshi", title: "Agri-Tech Specialist", speciality: "Precision farming, drone surveys & IoT sensors", rating: 4.7, consultations: 190, avatar: "\ud83d\udc68\u200d\ud83d\udcbb", available: true, fee: "\u20b9300/session" },
  { id: "e5", name: "Dr. Sunita Rao", title: "Water Management Expert", speciality: "Irrigation scheduling, drip design & water conservation", rating: 4.8, consultations: 210, avatar: "\ud83d\udc69\u200d\ud83d\udd2c", available: true, fee: "\u20b9250/session" },
  { id: "e6", name: "Rajendra More", title: "Market Analyst", speciality: "Commodity pricing, export advisory & contract farming", rating: 4.6, consultations: 340, avatar: "\ud83d\udc68\u200d\ud83d\udcbc", available: true, fee: "\u20b9150/session" },
];

export default function CommunityScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CommunityTab>("feed");

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-outline-100">
        <Pressable onPress={() => router.back()} className="mr-3">
          <Text className="text-typography-500 text-2xl">{"\u2190"}</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-typography-900 text-lg font-dm-sans-bold">
            {"\ud83d\udc65"} Farmer Community
          </Text>
          <Text className="text-typography-400 text-xs">Network, learn & share experiences</Text>
        </View>
        <Pressable className="bg-green-500 rounded-lg px-3 py-1.5">
          <Text className="text-white text-xs font-dm-sans-bold">+ Post</Text>
        </Pressable>
      </View>

      <View className="flex-row mx-5 mt-3 mb-3 bg-background-100 rounded-xl p-1">
        {(["feed", "experts", "groups", "events"] as CommunityTab[]).map((tab) => (
          <Pressable
            key={tab}
            className="flex-1 items-center py-2 rounded-lg"
            style={activeTab === tab ? { backgroundColor: "#16a34a" } : {}}
            onPress={() => setActiveTab(tab)}
          >
            <Text className={`text-xs font-dm-sans-medium capitalize ${activeTab === tab ? "text-white" : "text-typography-500"}`}>
              {tab === "feed" ? "\ud83d\udcac Feed" : tab === "experts" ? "\ud83c\udf93 Experts" : tab === "groups" ? "\ud83d\udc65 Groups" : "\ud83d\udcc5 Events"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {activeTab === "feed" && (
          <View className="px-5">
            {feed.map((post) => (
              <View key={post.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-center mb-3">
                  <View className="w-10 h-10 rounded-full bg-background-100 items-center justify-center">
                    <Text style={{ fontSize: 20 }}>{post.avatar}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm">{post.author}</Text>
                      {post.isExpert && (
                        <View className="bg-blue-100 rounded-full px-1.5 py-0.5 ml-1.5">
                          <Text className="text-blue-700" style={{ fontSize: 8 }}>{"\u2713"} Expert</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-typography-400 text-xs">{post.location} \u2022 {post.timestamp}</Text>
                  </View>
                </View>

                <Text className="text-typography-700 text-sm font-dm-sans-regular leading-5 mb-3">
                  {post.content}
                </Text>

                <View className="flex-row flex-wrap gap-1 mb-3">
                  {post.tags.map((tag, i) => (
                    <View key={i} className="bg-green-50 rounded-full px-2 py-0.5">
                      <Text className="text-green-700 text-xs">#{tag.replace(/\s/g, "")}</Text>
                    </View>
                  ))}
                </View>

                <View className="flex-row items-center pt-3 border-t border-outline-100">
                  <Pressable className="flex-row items-center flex-1">
                    <Text style={{ fontSize: 14 }}>{"\u2764\ufe0f"}</Text>
                    <Text className="text-typography-500 text-xs ml-1">{post.likes}</Text>
                  </Pressable>
                  <Pressable className="flex-row items-center flex-1">
                    <Text style={{ fontSize: 14 }}>{"\ud83d\udcac"}</Text>
                    <Text className="text-typography-500 text-xs ml-1">{post.comments} comments</Text>
                  </Pressable>
                  <Pressable className="flex-row items-center">
                    <Text style={{ fontSize: 14 }}>{"\ud83d\udd17"}</Text>
                    <Text className="text-typography-500 text-xs ml-1">Share</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "experts" && (
          <View className="px-5">
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-4">
              <Text className="text-blue-800 font-dm-sans-bold text-sm">
                {"\ud83c\udf93"} Consult Agricultural Experts
              </Text>
              <Text className="text-blue-600 text-xs mt-1">
                Video call, chat, or get field visit from certified agronomists
              </Text>
            </View>

            {experts.map((expert) => (
              <View key={expert.id} className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100">
                <View className="flex-row items-start">
                  <View className="w-14 h-14 rounded-full bg-background-100 items-center justify-center">
                    <Text style={{ fontSize: 28 }}>{expert.avatar}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center">
                      <Text className="text-typography-900 font-dm-sans-bold text-sm">{expert.name}</Text>
                      <View className={`rounded-full w-2 h-2 ml-2 ${expert.available ? "bg-green-500" : "bg-gray-300"}`} />
                    </View>
                    <Text className="text-typography-500 text-xs">{expert.title}</Text>
                    <Text className="text-typography-600 text-xs mt-1">{expert.speciality}</Text>
                    <View className="flex-row items-center mt-2">
                      <Text className="text-yellow-500 text-xs">{"\u2b50"} {expert.rating}</Text>
                      <Text className="text-typography-400 text-xs ml-2">{expert.consultations} consultations</Text>
                      <Text className="text-typography-700 text-xs font-dm-sans-bold ml-auto">{expert.fee}</Text>
                    </View>
                  </View>
                </View>
                <View className="flex-row gap-2 mt-3">
                  <Pressable
                    className="flex-1 rounded-xl py-2.5 items-center"
                    style={{ backgroundColor: expert.available ? "#16a34a" : "#d4d4d4" }}
                  >
                    <Text className="text-white text-xs font-dm-sans-bold">
                      {expert.available ? "\ud83d\udcf1 Consult Now" : "Unavailable"}
                    </Text>
                  </Pressable>
                  <Pressable className="flex-1 bg-background-100 rounded-xl py-2.5 items-center">
                    <Text className="text-typography-700 text-xs font-dm-sans-bold">{"\ud83d\udcc5"} Schedule</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "groups" && (
          <View className="px-5">
            {[
              { name: "Nashik Grape Growers", members: 1240, icon: "\ud83c\udf47", desc: "Export quality grape cultivation, pest management, post-harvest", active: "12 posts today" },
              { name: "Organic Farming Maharashtra", members: 3400, icon: "\ud83c\udf3f", desc: "Organic certification, bio-inputs, natural farming methods", active: "8 posts today" },
              { name: "Precision Agri-Tech", members: 890, icon: "\ud83d\udef0\ufe0f", desc: "Satellite monitoring, drones, IoT, AI in agriculture", active: "5 posts today" },
              { name: "Kharif Planning 2026", members: 2100, icon: "\ud83c\udf3e", desc: "Season planning, crop selection, input procurement", active: "15 posts today" },
              { name: "Tomato Growers Network", members: 760, icon: "\ud83c\udf45", desc: "Variety selection, disease management, market linkage", active: "6 posts today" },
              { name: "Water Conservation Forum", members: 1800, icon: "\ud83d\udca7", desc: "Drip, sprinkler, rainwater harvesting, micro-irrigation", active: "3 posts today" },
            ].map((group, i) => (
              <Pressable key={i}>
                <View className="bg-background-50 rounded-2xl p-4 mb-3 border border-outline-100 flex-row items-center">
                  <View className="w-12 h-12 rounded-xl bg-background-100 items-center justify-center">
                    <Text style={{ fontSize: 24 }}>{group.icon}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-typography-900 font-dm-sans-bold text-sm">{group.name}</Text>
                    <Text className="text-typography-500 text-xs">{group.desc}</Text>
                    <View className="flex-row items-center mt-1">
                      <Text className="text-typography-400 text-xs">{group.members.toLocaleString()} members</Text>
                      <Text className="text-green-600 text-xs ml-2">{group.active}</Text>
                    </View>
                  </View>
                  <Pressable className="bg-green-500 rounded-lg px-3 py-1.5">
                    <Text className="text-white text-xs font-dm-sans-bold">Join</Text>
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {activeTab === "events" && (
          <View className="px-5">
            {[
              { title: "Kharif Crop Planning Workshop", date: "Apr 15, 2026", time: "10 AM - 1 PM", location: "ICAR Nashik (Hybrid)", type: "Workshop", icon: "\ud83c\udf93", color: "#3b82f6", free: true },
              { title: "Drone Technology in Agriculture", date: "Apr 20, 2026", time: "2 PM - 4 PM", location: "Online Webinar", type: "Webinar", icon: "\ud83d\ude81", color: "#8b5cf6", free: true },
              { title: "Grape Export Quality Standards", date: "Apr 25, 2026", time: "11 AM - 3 PM", location: "APEDA Office, Nashik", type: "Seminar", icon: "\ud83c\udf47", color: "#22c55e", free: false },
              { title: "Soil Health & Carbon Credits", date: "May 2, 2026", time: "10 AM - 12 PM", location: "KVK Nashik", type: "Training", icon: "\ud83e\udea8", color: "#f59e0b", free: true },
              { title: "Annual Agri-Tech Expo Nashik", date: "May 15-17, 2026", time: "9 AM - 6 PM", location: "Nashik Convention Center", type: "Exhibition", icon: "\ud83c\udfaa", color: "#ef4444", free: false },
            ].map((event, i) => (
              <View key={i} className="bg-background-50 rounded-2xl overflow-hidden mb-3 border border-outline-100">
                <View className="h-2" style={{ backgroundColor: event.color }} />
                <View className="p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center">
                      <Text style={{ fontSize: 20 }}>{event.icon}</Text>
                      <View className="rounded-full px-2 py-0.5 ml-2" style={{ backgroundColor: event.color + "15" }}>
                        <Text className="text-xs font-dm-sans-medium" style={{ color: event.color }}>{event.type}</Text>
                      </View>
                    </View>
                    <View className={`rounded-full px-2 py-0.5 ${event.free ? "bg-green-50" : "bg-yellow-50"}`}>
                      <Text className={`text-xs font-dm-sans-bold ${event.free ? "text-green-700" : "text-yellow-700"}`}>
                        {event.free ? "Free" : "Paid"}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-typography-900 font-dm-sans-bold text-sm">{event.title}</Text>
                  <Text className="text-typography-500 text-xs mt-1">{"\ud83d\udcc5"} {event.date} \u2022 {event.time}</Text>
                  <Text className="text-typography-500 text-xs mt-0.5">{"\ud83d\udccd"} {event.location}</Text>
                  <Pressable className="mt-3 rounded-xl py-2.5 items-center" style={{ backgroundColor: event.color }}>
                    <Text className="text-white text-xs font-dm-sans-bold">Register Now</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
