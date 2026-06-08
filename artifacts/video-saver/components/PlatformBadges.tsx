import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { t } from "@/constants/i18n";

const PLATFORMS = [
  { key: "youtube", icon: "logo-youtube", color: "#FF0000", label: "youtube" },
  { key: "instagram", icon: "logo-instagram", color: "#E1306C", label: "instagram" },
  { key: "tiktok", icon: "musical-notes", color: "#69C9D0", label: "tiktok" },
  { key: "twitter", icon: "logo-twitter", color: "#1DA1F2", label: "twitter" },
  { key: "facebook", icon: "logo-facebook", color: "#1877F2", label: "facebook" },
  { key: "reddit", icon: "logo-reddit", color: "#FF4500", label: "reddit" },
] as const;

export function PlatformBadges() {
  const colors = useColors();
  const { language } = useApp();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {PLATFORMS.map((p) => (
        <View
          key={p.key}
          style={[styles.badge, { backgroundColor: p.color + "15", borderColor: p.color + "30" }]}
        >
          <Ionicons name={p.icon as any} size={16} color={p.color} />
          <Text style={[styles.badgeLabel, { color: p.color }]}>
            {t(language, p.label as any)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
});
