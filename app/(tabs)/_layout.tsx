import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'ホーム',
        }}
      />
      <Tabs.Screen
        name="read"
        options={{
          title: '占い',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '履歴',
        }}
      />
    </Tabs>
  );
}

