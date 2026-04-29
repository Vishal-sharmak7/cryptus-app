import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Providers & Context
import { AuthProvider, AuthContext } from './src/context/AuthContext';

// Screens
import AdminDashboard from './src/screens/admin/AdminDashboard';
import AdminUserList from './src/screens/admin/AdminUserList';
import AdminCourseList from './src/screens/admin/AdminCourseList';
import AdminStudentTeacherMapping from './src/screens/admin/AdminStudentTeacherMapping';
import AdminReportsList from './src/screens/admin/AdminReportsList';

import TeacherDashboard from './src/screens/teacher/TeacherDashboard';
import StudentDashboard from './src/screens/student/StudentDashboard';
import LoginScreen from './src/screens/auth/LoginScreen';
import WelcomeScreen from './src/screens/auth/WelcomeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// === Auth Stack (Login/Signup) ===
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

// === Main Tab Navigators based on Role ===
const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#2196F3' }, headerTintColor: '#FFF' }}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Overview' }} />
    <Stack.Screen name="AdminUserList" component={AdminUserList} options={{ title: 'Manage Users' }} />
    <Stack.Screen name="AdminCourseList" component={AdminCourseList} options={{ title: 'Enrolled Courses' }} />
    <Stack.Screen name="AdminStudentTeacherMapping" component={AdminStudentTeacherMapping} options={{ title: 'Relations' }} />
    <Stack.Screen name="AdminReportsList" component={AdminReportsList} options={{ title: 'Weekly Reports' }} />
  </Stack.Navigator>
);

const AdminTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#2196F3' }}>
    <Tab.Screen name="DashboardTab" component={AdminStack} options={{ title: 'Overview' }} />
  </Tab.Navigator>
);

const TeacherTabs = () => (
  <Tab.Navigator screenOptions={{ headerStyle: { backgroundColor: '#2196F3' }, headerTintColor: '#FFF', tabBarActiveTintColor: '#2196F3' }}>
    <Tab.Screen name="TeacherDashboard" component={TeacherDashboard} options={{ title: 'Approvals' }} />
    {/* Other tabs can be added here like 'My Roster' */}
  </Tab.Navigator>
);

const StudentTabs = () => (
  <Tab.Navigator screenOptions={{ headerStyle: { backgroundColor: '#2196F3' }, headerTintColor: '#FFF', tabBarActiveTintColor: '#2196F3' }}>
    <Tab.Screen name="StudentDashboard" component={StudentDashboard} options={{ title: 'My Courses' }} />
    {/* Other tabs can correspond to profile or grades */}
  </Tab.Navigator>
);

// === Root Navigator switching between Auth and Main stacks ===
const RootNavigator = () => {
  const { isLoading, userToken, userRole } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E3F2FD' }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken === null ? (
        <AuthStack />
      ) : (
        // Switch navigator based on the Role
        userRole === 'Admin' ? <AdminTabs /> :
          userRole === 'Teacher' ? <TeacherTabs /> :
            <StudentTabs />
      )}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
