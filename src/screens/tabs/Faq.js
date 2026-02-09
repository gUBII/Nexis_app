import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Accordion from 'react-native-collapsible/Accordion';
import {svg} from '../../assets/svg';
import {useTheme} from '../../constants/ThemeContext';


const frequentlyQuestions = [
  {
    id: '1',
    question: "What is saas ?",
    answer:
      'SaaS is a cloud-based software delivery model where users access applications over the internet.',
  },
  {
    id: '2',
    question: 'How does SaaS work? ?',
    answer:
      'SaaS providers host applications on their servers, and users access them via a browser or app',
  },
  {
    id: '3',
    question: 'What are the advantages of SaaS?',
    answer:
      'Flexibility, scalability, cost-efficiency, and ease of access from anywhere.',
  },
  {
    id: '4',
    question: 'What is a hybrid app ?',
    answer:
      'A hybrid app is a mobile application that combines elements of both native apps and web apps.',
  },
  {
    id: '5',
    question: 'Who manages SaaS updates?',
    answer:
      'The provider handles updates automatically.',
  },
  {
    id: '6',
    question: 'How do I know when updates are applied?',
    answer:
      'Providers usually notify users in advance via email or in-app notifications.',
  },
  {
    id: '7',
    question: 'What do you get from us ?',
    answer:
      'SaaS offers numerous advantages that make it a popular choice for businesses of all sizes, with many reasons to consider using it--from cost savings to enhanced collaboration.',
  },
];

const Faq = () => {
  const navigation = useNavigation();
  const [activeSections, setActiveSections] = useState([]);
  const {theme} = useTheme();

  const setSections = (sections) => {
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const renderHeader = () => {
    return (
      <View style={{paddingHorizontal: 20}}>
        <Text
          style={{
            color: theme === 'dark' ? '#fff' : '#000',
            fontSize: 24,
            marginTop: 15,
          }}
        >
          FAQ
        </Text>
      </View>
    );
  };

  const renderFaqHeader = (section, _, isActive) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#222222',
          height: 50,
          borderRadius: 10,
          paddingHorizontal: 10,
          borderWidth: 1,
        }}
      >
        <Text
          style={{
            textTransform: 'capitalize',
            color: 'white',
          }}
        >
          {section.question}
        </Text>
        {isActive ? <svg.ArrowCloseSvg /> : <svg.ArrowOpenSvg />}
      </View>
    );
  };

  const renderFaqContent = (section, _, isActive) => {
    return (
      <View
        style={{
          paddingLeft: 18,
          borderLeftWidth: 1,
          marginTop: 5,
        }}
      >
        <View>
          <Text
            style={{
              color: theme === 'dark' ? '#fff' : '#000',
            }}
          >
            {section.answer}
          </Text>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View style={{padding: 20}}>
        <TouchableOpacity
          style={{
            height: 40,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFD9C3',
            borderRadius: 10,
          }}
          onPress={() => navigation.navigate('OpenNewLoan')}
        >
          <Text
            style={{
              color: theme === 'dark' ? '#fff' : '#000',
            }}
          >
            + New Loan
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
          padding: 20,
          marginTop: 10,
        }}
      >
        <Accordion
          activeSections={activeSections}
          sections={frequentlyQuestions}
          touchableComponent={TouchableOpacity}
          renderHeader={renderFaqHeader}
          renderContent={renderFaqContent}
          duration={400}
          onChange={setSections}
          sectionContainerStyle={{
            marginHorizontal: 20,
            marginTop: 10,
          }}
        />
      </ScrollView>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme === 'dark' ? '#333' : '#fff',
      }}
    >
      {renderHeader()}
      {renderContent()}
    </View>
  );
};

export default Faq;
