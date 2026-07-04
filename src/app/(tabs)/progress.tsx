import { useState } from 'react';
import { View, ScrollView, Pressable, Image, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeadlineLg, HeadlineMd, LabelMd, BodyMd, Avatar, Card, DrawerMenu } from '@/components/ui';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors, darkColors } from '@/lib/theme';

const DAYS = [
  { label: 'M', completed: true },
  { label: 'T', completed: true },
  { label: 'W', completed: true },
  { label: 'T', completed: false },
  { label: 'F', completed: true },
  { label: 'S', completed: false },
  { label: 'S', completed: false },
];

function Header() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-row items-center justify-between border-b border-outline-variant/20 bg-surface-container-lowest px-6 py-4 dark:border-d-outline-variant/20 dark:bg-d-surface-container"
    >
      <View className="flex-row items-center gap-4">
        <Pressable className="p-2" onPress={() => setDrawerOpen(true)}>
          <MaterialIcons
            name="menu"
            size={24}
            color={isDark ? darkColors.primary : colors['primary-container']}
          />
        </Pressable>
        <HeadlineMd className="text-[18px] font-bold">Growth Report</HeadlineMd>
      </View>
      <Avatar
        source={{
          uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO6yiuzQofZufA6I4-OXdfFZAh9x7v0jIT9kxt-iATzVrbdGwuJCs8hFyYSPlw7_JpdmEOEKaLjYu1qx7y8zojSxuOz9jOnlJiY2fDa87tcmvFxvmNNUVhUkjtMUqSIQJUyFH_oa749qwAADzqWcBRZs7hp5zubC87qp9O535LPx-KtSPaiKErh-XyMJX0_MhR2CrF5ZiH9AWP5u3tpXW7ZaR-3yeUKA8WHkQ8n3Aggzo71aeGgorvZjBG5douIqN-G9vaFyt_a8b7',
        }}
        size="md"
      />
      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </View>
  );
}

function StreakCard() {
  return (
    <Card className="flex-row items-center justify-between">
      <View className="flex-1">
        <LabelMd className="mb-1">Current Streak</LabelMd>
        <HeadlineLg>12 Days</HeadlineLg>
        <BodyMd className="mt-3 text-[13px] text-on-surface-variant dark:text-d-on-surface-variant">
          {"You're in the top 5% of mindful users this week. Keep flowing."}
        </BodyMd>
      </View>
      <View className="h-14 w-14 items-center justify-center rounded-full bg-secondary-container dark:bg-d-secondary-container">
        <MaterialIcons name="water-drop" size={32} color="#8A496A" />
      </View>
    </Card>
  );
}

function DayCircle({ label, completed }: { label: string; completed: boolean }) {
  return (
    <View className="items-center gap-2">
      <LabelMd className="text-[11px] text-on-surface-variant dark:text-d-on-surface-variant">
        {label}
      </LabelMd>
      <View
        className={`h-10 w-10 items-center justify-center rounded-full ${
          completed
            ? 'bg-primary-container dark:bg-d-primary'
            : 'bg-surface-container-high dark:bg-d-surface-container-high'
        }`}
      >
        {completed ? (
          <MaterialIcons name="check" size={20} color="#FFFFFF" />
        ) : (
          <MaterialIcons name="circle" size={20} color="#C1C8C4" />
        )}
      </View>
    </View>
  );
}

function DailyAttendance() {
  return (
    <View className="gap-4">
      <HeadlineMd className="px-1 text-[20px]">Daily Attendance</HeadlineMd>
      <Card>
        <View className="flex-row justify-between">
          {DAYS.map((day, i) => (
            <DayCircle key={i} label={day.label} completed={day.completed} />
          ))}
        </View>
      </Card>
    </View>
  );
}

function StabilitySlider() {
  const [value, setValue] = useState(7);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const fillColor = isDark ? darkColors.primary : colors['primary-container'];
  const trackColor = isDark
    ? darkColors['surface-container-high']
    : colors['surface-container-high'];

  return (
    <View>
      {/* Track */}
      <View
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: trackColor }}
      >
        <View
          className="h-full rounded-full"
          style={{ width: `${((value - 1) / 9) * 100}%`, backgroundColor: fillColor }}
        />
      </View>
      {/* Tappable scale */}
      <View className="mt-4 flex-row justify-between px-1">
        {Array.from({ length: 10 }, (_, i) => (
          <Pressable key={i} onPress={() => setValue(i + 1)} className="items-center px-1">
            <LabelMd
              className={`text-[11px] ${
                i + 1 === value
                  ? 'text-primary dark:text-d-primary'
                  : 'text-on-surface-variant dark:text-d-on-surface-variant'
              }`}
            >
              {i + 1}
            </LabelMd>
          </Pressable>
        ))}
      </View>
      {/* Labels */}
      <View className="mt-5 flex-row items-center justify-between">
        <LabelMd className="text-[11px] uppercase tracking-wider text-on-surface-variant/60 dark:text-d-on-surface-variant/60">
          Restless
        </LabelMd>
        <LabelMd className="text-[11px] uppercase tracking-wider text-on-surface-variant/60 dark:text-d-on-surface-variant/60">
          Centered
        </LabelMd>
      </View>
    </View>
  );
}

function EmotionalStability() {
  return (
    <View className="gap-4">
      <View className="px-1">
        <HeadlineMd className="text-[20px]">Emotional Stability</HeadlineMd>
        <BodyMd className="mt-1 text-[13px] text-on-surface-variant dark:text-d-on-surface-variant">
          {
            "Assess how centered you've felt today. This helps us tailor your upcoming meditation recommendations."
          }
        </BodyMd>
      </View>
      <Card className="px-6 py-8">
        <StabilitySlider />
      </Card>
    </View>
  );
}

function TranquilityBanner() {
  return (
    <View className="h-48 overflow-hidden rounded-xl">
      <Image
        source={{
          uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1YfX25u3yPnTCUZin6RvjbuKJ2KZ4eHBQ_09gg-zkXeIBxiQJAkk-SVRQnfYdUBeEZsu-fFubMaizL6uSrFiNFc0CAtybRzU3kZ8XD3XZyTzBVDDsOATt9VJtj6bbn2HPeYmqwSE9FvLNQ_I2VbtkoyIFm6avJGcboXIRpY_mj8kzvnuwJJ2jzWu3w7aqoU7skK1CiQFfbYwjiHpgE1zXbQ-xrAVu6U8CB2I-4v5GPFvOiFNFkdgJV_584rjJj3QSk0jL4pUETdVy',
        }}
        className="h-full w-full"
        resizeMode="cover"
      />
      <View className="absolute inset-0 items-center justify-center bg-primary-container/20">
        <HeadlineMd className="uppercase tracking-widest text-white opacity-80">
          Tranquility
        </HeadlineMd>
      </View>
    </View>
  );
}

export default function ProgressScreen() {
  return (
    <View className="flex-1 bg-surface dark:bg-d-surface">
      <Header />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-8 px-6 pb-8 pt-6"
      >
        <StreakCard />
        <DailyAttendance />
        <EmotionalStability />
        <TranquilityBanner />
      </ScrollView>
    </View>
  );
}
