import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import {svg} from '../../assets/svg';
import {useTheme} from '../../constants/ThemeContext';

const notifications = [
  {
    id: 1,
    title: 'Your NDIS application has been updated!',
    status: 'completed',
    date: 'Apr 12, 2023 at 12:47 PM',
  },
  {
    id: 2,
    title: 'Your Subscription period expires!',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    status: 'alert',
    date: 'Apr 12, 2023 at 12:47 PM',
  },
  {
    id: 3,
    title: 'Your Task asignment was rejected!',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    status: 'rejected',
    date: 'Apr 12, 2023 at 12:47 PM',
  },
  {
    id: 4,
    title: 'Your Task has been Completed!',
    status: 'completed',
    date: 'Apr 12, 2023 at 12:47 PM',
  },
];

const Notification = () => {
  const {theme} = useTheme();

  const renderHeader = () => {
    return (
      <View
       style={{paddingHorizontal: 20}}
       >
        <Text
          style={{
            color: theme === 'dark' ? '#fff' : '#000',
            fontSize: 24,
          }}
        >
          Notifications
        </Text>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          marginTop: 10,
        }}
      >
        {notifications.map((item, index, array) => {
          const last = array.length - 1 === index;

          return (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: 'black',
                marginBottom: last ? 0 : 10,
                padding: 20,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 14,
                }}
              >
                {item.status === 'completed' && (
                  <View style={{marginRight: 8}}>
                    <svg.CompletedNoticeSvg />
                  </View>
                )}
                {item.status === 'alert' && (
                  <View style={{marginRight: 8}}>
                    <svg.AlertSvg />
                  </View>
                )}
                {item.status === 'rejected' && (
                  <View style={{marginRight: 8}}>
                    <svg.RejectedSvg />
                  </View>
                )}
                <Text
                  style={{
                    color: '#fff',
                  }}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
              </View>
              {item.description && (
                <Text
                  style={{
                    marginBottom: 14,
                    color: '#fff',
                  }}
                >
                  {item.description}
                </Text>
              )}
              <Text
                style={{
                  color: '#fff',
                }}
              >
                {item.date}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme === 'dark' ? '#333' : '#fff',
        marginTop: 10,
      }}
    >
      {renderHeader()}
      {renderContent()}
    </ScrollView>
  );
};

export default Notification;
