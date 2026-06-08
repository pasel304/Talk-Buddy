import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { t, detectPlatform, getPlatformColor, isValidUrl } from "@/constants/i18n";

interface UrlInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const PLATFORM_ICONS: Record<string, string> = {
  youtube: "logo-youtube",
  instagram: "logo-instagram",
  tiktok: "musical-notes",
  twitter: "logo-twitter",
  facebook: "logo-facebook",
  reddit: "logo-reddit",
  other: "link",
};

export function UrlInput({ value, onChangeText, onSubmit, loading }: UrlInputProps) {
  const colors = useColors();
  const { language } = useApp();
  const isRTL = language === "ar";
  const platform = value ? detectPlatform(value) : "other";
  const platformColor = getPlatformColor(platform);
  const valid = isValidUrl(value);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        onChangeText(text);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch {}
  };

  const handleClear = () => {
    onChangeText("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDownload = () => {
    animatePress();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSubmit();
  };

  const styles = StyleSheet.create({
    container: {
      gap: 12,
    },
    inputContainer: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      borderWidth: 1.5,
      borderColor: value && valid ? platformColor + "60" : colors.border,
      overflow: "hidden",
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 4,
      gap: 10,
    },
    platformIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: value && valid ? platformColor + "20" : colors.muted,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: colors.foreground,
      paddingVertical: 14,
      fontFamily: "Inter_400Regular",
      textAlign: isRTL ? "right" : "left",
    },
    actionRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 8,
    },
    pasteBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      backgroundColor: colors.secondary,
      borderRadius: colors.radius - 4,
      paddingVertical: 12,
    },
    pasteBtnText: {
      color: colors.primary,
      fontSize: 14,
      fontFamily: "Inter_500Medium",
    },
    downloadBtn: {
      flex: 2,
      borderRadius: colors.radius - 4,
      overflow: "hidden",
    },
    downloadBtnInner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      backgroundColor: valid && !loading ? colors.primary : colors.muted,
    },
    downloadBtnText: {
      color: valid && !loading ? colors.primaryForeground : colors.mutedForeground,
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
    hint: {
      fontSize: 12,
      color: colors.mutedForeground,
      textAlign: "center",
      fontFamily: "Inter_400Regular",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <View style={styles.platformIcon}>
            <Ionicons
              name={PLATFORM_ICONS[platform] as any}
              size={18}
              color={value && valid ? platformColor : colors.mutedForeground}
            />
          </View>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={t(language, "pasteHint")}
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="done"
            onSubmitEditing={valid ? onSubmit : undefined}
            editable={!loading}
          />
          {value.length > 0 && (
            <Pressable onPress={handleClear} hitSlop={8}>
              <Ionicons name="close-circle" size={20} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.pasteBtn} onPress={handlePaste}>
          <Ionicons name="clipboard-outline" size={16} color={colors.primary} />
          <Text style={styles.pasteBtnText}>{t(language, "pasteFromClipboard")}</Text>
        </Pressable>

        <Animated.View style={[styles.downloadBtn, { transform: [{ scale: scaleAnim }] }]}>
          <Pressable
            style={styles.downloadBtnInner}
            onPress={handleDownload}
            disabled={!valid || loading}
          >
            {loading ? (
              <Ionicons name="hourglass-outline" size={20} color={colors.mutedForeground} />
            ) : (
              <Ionicons
                name="download-outline"
                size={20}
                color={valid ? colors.primaryForeground : colors.mutedForeground}
              />
            )}
            <Text style={styles.downloadBtnText}>
              {loading ? t(language, "downloading") : t(language, "download")}
            </Text>
          </Pressable>
        </Animated.View>
      </View>

      <Text style={styles.hint}>{t(language, "downloadHint")}</Text>
    </View>
  );
}
