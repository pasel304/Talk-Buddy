import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { type DownloadRecord } from "@/context/AppContext";
import { detectPlatform, getPlatformColor, t } from "@/constants/i18n";
import { buildDownloadUrl } from "@/constants/i18n";

const PLATFORM_ICONS: Record<string, string> = {
  youtube: "logo-youtube",
  instagram: "logo-instagram",
  tiktok: "musical-notes",
  twitter: "logo-twitter",
  facebook: "logo-facebook",
  reddit: "logo-reddit",
  other: "link",
};

interface HistoryItemProps {
  record: DownloadRecord;
  onDelete: (id: string) => void;
}

function formatTime(ts: number, lang: "ar" | "en"): string {
  const date = new Date(ts);
  return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryItem({ record, onDelete }: HistoryItemProps) {
  const colors = useColors();
  const { language } = useApp();
  const isRTL = language === "ar";
  const platform = detectPlatform(record.url);
  const platformColor = getPlatformColor(platform);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const downloadUrl = buildDownloadUrl(record.url);
    await Linking.openURL(downloadUrl);
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDelete(record.id);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 14,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: platformColor + "20",
    },
    content: {
      flex: 1,
      gap: 3,
    },
    title: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
      textAlign: isRTL ? "right" : "left",
    },
    urlText: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: isRTL ? "right" : "left",
    },
    timeText: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: isRTL ? "right" : "left",
    },
    actions: {
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 8,
    },
    actionBtn: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={PLATFORM_ICONS[platform] as any}
          size={22}
          color={platformColor}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {record.title || t(language, "noTitle")}
        </Text>
        <Text style={styles.urlText} numberOfLines={1}>
          {record.url}
        </Text>
        <Text style={styles.timeText}>
          {formatTime(record.downloadedAt, language)}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary + "15" }]}
          onPress={handlePress}
        >
          <Ionicons name="download-outline" size={18} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.destructive + "15" }]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={18} color={colors.destructive} />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}
