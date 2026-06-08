import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { t } from "@/constants/i18n";

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, setLanguage, themeMode, setThemeMode, isDark, clearHistory } = useApp();
  const isRTL = language === "ar";

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
      gap: 4,
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    headerTitle: {
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      letterSpacing: -0.5,
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
      gap: 8,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    row: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 12,
    },
    rowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rowIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    rowContent: {
      flex: 1,
    },
    rowLabel: {
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
      textAlign: isRTL ? "right" : "left",
    },
    rowSub: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: isRTL ? "right" : "left",
    },
    optionRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 8,
    },
    option: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: "center",
      borderWidth: 1.5,
    },
    optionText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
    },
    dangerBtn: {
      backgroundColor: colors.destructive + "15",
      borderRadius: colors.radius,
      padding: 16,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 10,
      borderWidth: 1,
      borderColor: colors.destructive + "30",
    },
    dangerBtnText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.destructive,
    },
  });

  const THEMES: Array<{ mode: "light" | "dark" | "system"; label: keyof typeof import("@/constants/i18n").translations.en; icon: string }> = [
    { mode: "light", label: "lightMode", icon: "sunny-outline" },
    { mode: "dark", label: "darkMode", icon: "moon-outline" },
    { mode: "system", label: "systemDefault", icon: "phone-portrait-outline" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t(language, "settings")}</Text>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t(language, "language")}</Text>
          <View style={styles.optionRow}>
            {(["ar", "en"] as const).map((lang) => {
              const selected = language === lang;
              return (
                <Pressable
                  key={lang}
                  style={[
                    styles.option,
                    {
                      backgroundColor: selected ? colors.primary + "20" : colors.card,
                      borderColor: selected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => {
                    setLanguage(lang);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text style={[styles.optionText, { color: selected ? colors.primary : colors.foreground }]}>
                    {lang === "ar" ? "العربية" : "English"}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Theme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t(language, "theme")}</Text>
          <View style={styles.optionRow}>
            {THEMES.map(({ mode, label, icon }) => {
              const selected = themeMode === mode;
              return (
                <Pressable
                  key={mode}
                  style={[
                    styles.option,
                    {
                      backgroundColor: selected ? colors.primary + "20" : colors.card,
                      borderColor: selected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => {
                    setThemeMode(mode);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Ionicons
                    name={icon as any}
                    size={18}
                    color={selected ? colors.primary : colors.mutedForeground}
                  />
                  <Text style={[styles.optionText, { color: selected ? colors.primary : colors.foreground, marginTop: 4 }]}>
                    {t(language, label as any)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Clear History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t(language, "history")}</Text>
          <Pressable
            style={styles.dangerBtn}
            onPress={() => {
              clearHistory();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }}
          >
            <Ionicons name="trash-outline" size={20} color={colors.destructive} />
            <Text style={styles.dangerBtnText}>{t(language, "clearHistory")}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
