import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

function TabIcon({ name, color }: { name: any; color: string }) {
  return <FontAwesome name={name} size={28} style={{ marginBottom: -3 }} color={color} />;
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#4CAF50',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color }) => <TabIcon name="camera" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <TabIcon name="comments" color={color} />,
        }}
      />
    </Tabs>
  );
}
