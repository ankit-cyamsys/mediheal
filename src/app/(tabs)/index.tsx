import { useState } from 'react';
import { View, ScrollView, Image, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeadlineMd, LabelMd, LabelSm, BodyMd, Avatar, Badge, DrawerMenu } from '@/components/ui';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const FILTER_CHIPS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const DAILY_SESSIONS = [
  {
    id: '1',
    title: 'Morning Clarity',
    duration: '10 mins',
    views: '12.4k views',
    badge: 'Highly Recommended',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCS6A5SthlGe-52WtjH5a0mJpoGnYUQqsvbieP_3PSD4BSuCDlTwucezUd-rDBId8BwmT_Wlzf7vbVVdn2WS2wLwfnCYIvNkhqKBimvOBTcCM-Ors9dC_nCoI06CxvEXXBF1yxiMIVI0SFZI-YPKoK85m7QH6pPpdPOUmBQIGUUXNAaEbPEH-kybwa3jXq1H2y_JY-XF2SpdGKiz03CasX9869su1UII1B7TypUFPJMOomm422dsU3ynEjNNrrJnIIoE_CADqsmdzrw',
  },
  {
    id: '2',
    title: 'Breath Awareness',
    duration: '15 mins',
    views: '8.2k views',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDFdhYS7-lhC42YiOhkI5WzEE8JBrW7jJxWzRzOph5oi21y92ZG6lX-ivEkvmwVpcKTvdpu93jFwQHDDJxgaoJFhBXXVFUgO7Y9I1dKU7u_VxLTA2_RD4Ba6-x1cvIxHaSrFXRdkI3qDq73pbY0Sh9WeOnUhEBfZnPJ3tWY9GXCKSIjXztsU9GiYb9BMRQvPbt-nPzgYy6JPTiO1uZ7Hhr03iWYEYkLWIwJyQhDOED9Pc6aKXc4wPV_P6WFzgBOOjQeyV8JE1h82Bwc',
  },
];

const CREATORS = [
  {
    id: '1',
    name: 'Sarah',
    specialty: 'Mindfulness & Stress Relief',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjSshlCV4eU5RJcmOyVPNPupYed3xwyZiW_GfpfoVn3QY1fCvIHNeFaBS-iE7kCfAEOv0qV9rg3LdXClGtefbi00YjBpY1dzqcpi_UE79Awl7whH9LdWTx7fzRm3aKpP5IcmK56OcANzLFt1-MDQd4J9y9sCyHAFpVqRttN9hJ-ygbYVwcwxjyiqkNgfWtglEydaaUkJepZ9bKMFWX6Ma_jkehhwmL-0Sg22pDH2F7Q51DeFxNEDWGTlcNv_IxqJuOZqIfBsDydkgB',
  },
  {
    id: '2',
    name: 'Marcus',
    specialty: 'Deep Sleep Specialist',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBTDepUISJyffaih7XkHcxhpSTg4vlVfxU48vT2Znmkk9vg6dfY2ByKIdKCV2vQr7ZN-7FEamGaQeh7Pi5t3MQY0j5uaG1cFXiErVjfWkMvpiFukmcxLsYm6h-J-ti5SZk12Z_p28ePwzJvUFkkp45M8Nxy7tggJgX6HMg4nl0eQlJfDR5pshx4I7aAYK78TqLBMG5vlNsrA90Rveg1phFrNewtsvBCvBvq1mlXywVOU7ussrn_ZVshIEr3qJTGksPDj_m9p7IJdpSz',
  },
  {
    id: '3',
    name: 'Elena',
    specialty: 'Zen Yoga & Flow',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuASlkndqDCI94c3twRc-KtPYviNEVy2Nv5ACwbyTtaqFZTgqh2YQCvLh9OFCKOjz52jgaK0Mf0HDCBQONI5sUrjqErDXesuIxZhOjItl3LxRqRYnjxMhgyIn41lavPgxbqygphNsZ8u7T7T5LIGcUgsBHU67pX_hooZljrtPI5ip1Iet9zC4X-cOsKeW0eaEtQMUvtqt_gTTiOOlzHWwlLH3k6VPAC04_9r8-v3gaA2bzYaLnqGcy19eGqsb8rk1HMy-2-oE5CysOct',
  },
  {
    id: '4',
    name: 'Julian',
    specialty: 'Guided Breathwork',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCK0K0K0K0K0K0K0K0K0K0K0K0K0K0K0K0K0K0K',
  },
  {
    id: '5',
    name: 'Maya',
    specialty: 'Anxiety Management',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCL0L0L0L0L0L0L0L0L0L0L0L0L0L0L0L0L0L0L',
  },
];

const EVENING_SESSIONS = [
  {
    id: '1',
    title: 'Deep Sleep',
    duration: '20m',
    views: '45k',
    favorited: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC5-em-I8oYpkFAdddaerjFo15RlnyAig-OJzp2eV6oRt8LsIxky633TIMYV53p25BoKgmkXjr5msYZCb56kxh1GxY7JsLVKK70p1hZfAMk4pdfFAdgycF7pNQHzNmSFJYFXA_jQpWZ17PTO3rpokSIdToIl8k9Jzh1wZzwFYI_ZxLfji3w3LDL0JndOQQTGarshZnQsYCwE89I9inEMEkX6Mp8CvRzpukHIYRuiUMbxHxT_zUHEb_PZZLgHMXsuJWOy56_OOspCDTP',
  },
  {
    id: '2',
    title: 'Body Scan',
    duration: '12m',
    views: '31k',
    favorited: false,
    badge: 'RECOMMENDED',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCBt-F0NqV_1ptvL6COUFdL-JTjHVaRroN27o8nNB8hWL-ytHiKlpxaDMTCOvSrZ624FgnI-kmhimmv__E63nUZD6nCh-vGqwQF8LNv4Kxsk3WzpHjMga0Y-yoxvVr83_QyGmhQk05bEbUPdVLN-sCINF47bCLC6-k43wqxaGz3-egCXAXiNdN2ke2C_G5GjuMD4kfgttZNmrqmXflVYCADTrC3j3RUID98I06aif3VvBthUeuTCaAgzOMW7Q2xQEYdasSm-glDDHs5',
  },
  {
    id: '3',
    title: 'Wind Down',
    duration: '8m',
    views: '19k',
    favorited: false,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCQNitmalZpeHQr1lIDKi2iOIcnYxhdNROTV1TxrVFjB7ks0ID7WRUi59ffy_1fCqSVw62ipfza-9G-cRcT0Q66wGqZTB7VCZ_ZPdcUf9wcy-prSxufu5QFz-XeJ9cIWk9Sq1rpJDNoNI9tWiu0dT1P2LS1A6T05BMwRpzaXYwQxMqFHMRV4IrTw2wwdaABIcSLKffNdpi1RRdksrDI-ZEskY-uVt5vWl7l9csTtYqiWE3W1K1fYKfGn0j_rdLbNhT5-Su8E2wKCFrq',
  },
  {
    id: '4',
    title: 'Release',
    duration: '15m',
    views: '22k',
    favorited: false,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBhR0jerasGIPGexf2kAsACRGG6m82xkI1Tc25m2zCNSMPlbWUE06H1pruzWZ9bGhpGcygxg_f0nhh7SpILREw-m3M2XfewwCMqscyfCv2ydpKkPSXO26TA9BXRr6-svHJAUQFcWn--6mLvN67vdqEWgAQWXomrpmzzRMD5KHAGqFqvETIzxbyWgc-h-tUsyErrjfUqL5a2swGA57geyEt9ndfyCUv_9HlMvWrojBnE9oG0qqA0To6UKEgXCw5XlDIAUlRDsfxANCZX',
  },
];

function Header() {
  const insets = useSafeAreaInsets();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-row items-center justify-between border-b border-outline-variant/20 bg-surface-container-lowest px-4 py-3 dark:border-d-outline-variant/20 dark:bg-d-surface-container"
    >
      <View className="flex-row items-center gap-3">
        <Pressable className="p-2" onPress={() => setDrawerOpen(true)}>
          <MaterialIcons name="menu" size={24} color="#1E3F35" />
        </Pressable>
        <HeadlineMd className="text-[18px] text-primary-container dark:text-d-primary">
          Serenity
        </HeadlineMd>
      </View>
      <View className="flex-row items-center gap-3">
        <Pressable className="p-2">
          <MaterialIcons name="translate" size={24} color="#1E3F35" />
        </Pressable>
        <Avatar
          source={{
            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcIGRbOFf1ZT3Azl9Hiiz9ObbU5U8CRyodJut6U1dOhzuh_i63qTHGAFXQfmx7xEF8XovkNhZcaG__shlLUgtj2E4oV02ONAI8-TI3Tad3E85HPtJdoom0R4-LlKINS2dc9ZmfVm_esw6ZXED7lWyMiz4HQnOd6SUwilopxXhUxmggphi8CL2QyedXtTCssfb3Ax9WcRzN7Qv4EHVIcFuKViuTKh6_YYdse4mG49i0hIYTK4J-g12naZzqX9PKcNXKNBpFxqqyaRxZ',
          }}
          size="md"
        />
      </View>
      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </View>
  );
}

function FilterChips() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-6"
      contentContainerClassName="gap-3 px-4"
    >
      {FILTER_CHIPS.map((chip, i) => (
        <Pressable
          key={chip}
          className={`rounded-full px-5 py-2 ${
            i === 0
              ? 'bg-primary-container dark:bg-d-primary'
              : 'border border-outline-variant/30 bg-surface-container-high/60 dark:border-d-outline-variant/30 dark:bg-d-surface-container-high/60'
          }`}
        >
          <LabelMd
            className={
              i === 0 ? 'text-white dark:text-d-on-primary' : 'text-primary dark:text-d-on-surface'
            }
          >
            {chip}
          </LabelMd>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function SectionHeader({ title, onViewAll }: { title: string; onViewAll?: () => void }) {
  return (
    <View className="mb-4 flex-row items-center justify-between px-4">
      <HeadlineMd className="text-[20px]">{title}</HeadlineMd>
      {onViewAll && (
        <Pressable onPress={onViewAll}>
          <LabelMd className="text-secondary dark:text-d-secondary">View all</LabelMd>
        </Pressable>
      )}
    </View>
  );
}

function DailyFoundationCard({ session }: { session: (typeof DAILY_SESSIONS)[0] }) {
  return (
    <Pressable className="mb-4 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest dark:border-d-outline-variant/30 dark:bg-d-surface-container">
      <View className="relative h-44">
        <Image source={{ uri: session.image }} className="h-full w-full" resizeMode="cover" />
        {session.badge && (
          <View className="absolute left-3 top-3">
            <Badge>{session.badge}</Badge>
          </View>
        )}
      </View>
      <View className="flex-row items-end justify-between p-4">
        <View className="flex-1">
          <BodyMd className="font-semibold text-primary dark:text-d-on-surface">
            {session.title}
          </BodyMd>
          <LabelMd className="mt-1 text-outline dark:text-d-outline">
            {session.duration} • {session.views}
          </LabelMd>
        </View>
        <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-primary-container dark:bg-d-primary">
          <MaterialIcons name="play-arrow" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
    </Pressable>
  );
}

function CreatorsSection() {
  return (
    <View className="mb-8">
      <SectionHeader title="Meet Our Creators" onViewAll={() => {}} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-5 px-4"
      >
        {CREATORS.map((creator) => (
          <Pressable key={creator.id} className="w-20 items-center">
            <Avatar source={{ uri: creator.image }} size="xl" />
            <LabelMd className="mt-2 text-center text-[12px] text-primary dark:text-d-on-surface">
              {creator.name}
            </LabelMd>
            <LabelSm className="mt-0.5 text-center text-[10px] font-normal normal-case leading-tight tracking-normal text-outline dark:text-d-outline">
              {creator.specialty}
            </LabelSm>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function EveningRestCard({ session }: { session: (typeof EVENING_SESSIONS)[0] }) {
  return (
    <Pressable className="flex-1 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-2 dark:border-d-outline-variant/30 dark:bg-d-surface-container">
      <View className="relative mb-2 aspect-square overflow-hidden rounded-lg">
        <Image source={{ uri: session.image }} className="h-full w-full" resizeMode="cover" />
        {session.badge && (
          <View className="absolute bottom-2 left-2 rounded bg-surface-container-lowest/90 px-1.5 py-0.5 dark:bg-d-primary/90">
            <LabelSm className="text-[9px] normal-case text-primary dark:text-d-on-primary">
              {session.badge}
            </LabelSm>
          </View>
        )}
      </View>
      <LabelMd className="text-primary dark:text-d-on-surface" numberOfLines={1}>
        {session.title}
      </LabelMd>
      <View className="mt-1 flex-row items-center justify-between">
        <LabelSm className="text-[11px] font-normal normal-case tracking-normal text-outline dark:text-d-outline">
          {session.duration} • {session.views}
        </LabelSm>
        <MaterialIcons
          name="favorite"
          size={16}
          color={session.favorited ? '#8A496A' : '#717975'}
        />
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-surface dark:bg-d-surface">
      <Header />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View className="px-4 pb-4 pt-6">
          <HeadlineMd className="text-center">Good morning, Avery Chen</HeadlineMd>
        </View>

        {/* Filter Chips */}
        <FilterChips />

        {/* Daily Foundation */}
        <View className="mb-8">
          <SectionHeader title="Daily Foundation" onViewAll={() => {}} />
          <View className="px-4">
            {DAILY_SESSIONS.map((session) => (
              <DailyFoundationCard key={session.id} session={session} />
            ))}
          </View>
        </View>

        {/* Creators */}
        <CreatorsSection />

        {/* Evening Rest */}
        <View className="mb-8">
          <SectionHeader title="Evening Rest" onViewAll={() => {}} />
          <View className="px-4">
            <View className="mb-3 flex-row gap-3">
              <EveningRestCard session={EVENING_SESSIONS[0]} />
              <EveningRestCard session={EVENING_SESSIONS[1]} />
            </View>
            <View className="flex-row gap-3">
              <EveningRestCard session={EVENING_SESSIONS[2]} />
              <EveningRestCard session={EVENING_SESSIONS[3]} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
