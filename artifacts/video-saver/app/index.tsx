import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { UrlInput } from "@/components/UrlInput";
import { PlatformBadges } from "@/components/PlatformBadges";
import { HistoryItem } from "@/components/HistoryItem";
import {
  t,
  isValidUrl,
  detectPlatform,
  buildDownloadUrl,
} from "@/constants/i18n";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, isDark, history, addToHistory, removeFromHistory } = useApp();
  const isRTL = language === "ar";
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!isValidUrl(url)) return;
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const platform = detectPlatform(url);
    const downloadUrl = buildDownloadUrl(url);

    await addToHistory({
      url,
      title: url,
      platform,
    });

    await Linking.openURL(downloadUrl);
    setLoading(false);
    setUrl("");
  };

  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : insets.bottom;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: topPad + 16,
      paddingBottom: bottomPad + 24,
      paddingHorizontal: 20,
      gap: 24,
    },
    header: {
      gap: 6,
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    appName: {
      fontSize: 32,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      letterSpacing: -0.5,
    },
    tagline: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    sectionTitle: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      textAlign: isRTL ? "right" : "left",
    },
    section: {
      gap: 10,
    },
    historyList: {
      gap: 8,
    },
    emptyContainer: {
      alignItems: "center",
      paddingVertical: 32,
      gap: 10,
    },
    emptyText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
    },
    howToCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    stepRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 12,
    },
    stepNum: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary + "20",
      alignItems: "center",
      justifyContent: "center",
    },
    stepNumText: {
      fontSize: 13,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
    },
    stepText: {
      flex: 1,
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      textAlign: isRTL ? "right" : "left",
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>{t(language, "appName")}</Text>
          <Text style={styles.tagline}>{t(language, "appTagline")}</Text>
        </View>

        {/* URL Input + Download */}
        <UrlInput
          value={url}
          onChangeText={setUrl}
          onSubmit={handleDownload}
          loading={loading}
        />

        {/* Platform Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t(language, "supportedPlatforms")}</Text>
          <PlatformBadges />
        </View>

        {/* How To Use */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t(language, "howToUse")}</Text>
          <View style={styles.howToCard}>
            {[
              t(language, "step1"),
              t(language, "step2"),
              t(language, "step3"),
            ].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t(language, "history")}</Text>
          {history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t(language, "noHistory")}</Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {history.slice(0, 20).map((record) => (
                <HistoryItem
                  key={record.id}
                  record={record}
                  onDelete={removeFromHistory}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
