import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CRM from '../screens/CRM';
import HRM from '../screens/HRM';
import Webview from '../screens/Webview';
import Modules from '../screens/Modules';
import ACCOUNT from '../screens/ACCOUNT';
import Mode from '../screens/Mode';
import MyComponent from '../screens/MyComponent';
import Dashboard from '../screens/tabs/Dashboard';
import AttendanceRecord from '../screens/AttendanceRecord';
import TimeSheet from '../screens/TimeSheet';
import AnalogClock from '../screens/AnalogClock';
import Task from '../screens/Task';
import MyJobs from '../screens/MyJobs';


const Stack = createNativeStackNavigator();

import {screens} from '../screens';

import TabNavigator from './TabNavigator'; 

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='SplashScreenc'
        component={screens.SplashScreenc}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Onboarding'
        component={screens.Onboarding}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='SignUp'
        component={screens.SignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='VerifyYourPhoneNumber'
        component={screens.VerifyYourPhoneNumber}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='SignIn'
        component={screens.SignIn}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='TabNavigator'
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='OpenDeposit'
        component={screens.OpenDeposit}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='OpenMoneybox'
        component={screens.OpenMoneybox}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Profile'
        component={screens.Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='EditPersonalInfo'
        component={screens.EditPersonalInfo}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name='BackgroundExample'
        component={screens.BackgroundExample}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='OpenNewCard'
        component={screens.OpenNewCard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='BocForm'
        component={screens.BocForm}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name='EodForm'
        component={screens.EodForm}
        options={{headerShown: false}}
      />
        <Stack.Screen
        name='Lead'
        component={screens.Lead}
        options={{headerShown: false}}
      />
        <Stack.Screen
        name='DocumentManager'
        component={screens.DocumentManager}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name='ViewCategory'
        component={screens.ViewCategory}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name='AddCategory'
        component={screens.AddCategory}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name='AddDocument'
        component={screens.AddDocument}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ViewDocument'
        component={screens.ViewDocument}
        options={{headerShown: false}}
      />
        <Stack.Screen
        name='IncidentForm'
        component={screens.IncidentForm}
        options={{headerShown: false}}
      />
         <Stack.Screen
        name='Nexisbot'
        component={screens.Nexisbot}
        options={{headerShown: false}}
      />
        <Stack.Screen
        name='ViewCampaign'
        component={screens.ViewCampaign} 
        options={{headerShown: false}}
      />
       <Stack.Screen
        name='Notifications' 
        component={screens.Notifications}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name='EditCampaignForm'
        component={screens.EditCampaignForm}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='EditLeadForm'
        component={screens.EditLeadForm}
        options={{headerShown: false}} 
      />
      <Stack.Screen
        name='Nextbot'
        component={screens.Nextbot}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Call'
        component={screens.Call}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name='Email'
        component={screens.Email}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Minutes'
        component={screens.Minutes}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Cases'
        component={screens.Cases}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Quote'
        component={screens.Quote}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Deal'
        component={screens.Deal}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name='Onboard'
        component={screens.Onboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Contract'
        component={screens.Contract}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='EditCall'
        component={screens.EditCall}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='EditEmail'
        component={screens.EditEmail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='EditMinutes'
        component={screens.EditMinutes}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='EditCases'
        component={screens.EditCases}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='EditQuote'
        component={screens.EditQuote}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='EditDeal'
        component={screens.EditDeal}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='EditContract'
        component={screens.EditContract}
        options={{headerShown: false}}
      />
        <Stack.Screen
        name='ViewLead' 
        component={screens.ViewLead}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name='CampaignForm'
        component={screens.CampaignForm}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name='LeadForm'
        component={screens.LeadForm}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='CreateInvoice'
        component={screens.CreateInvoice}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='InvoiceSent'
        component={screens.InvoiceSent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Statistics'
        component={screens.Statistics}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='FAQ'
        component={screens.FAQ}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='PrivacyPolicy'
        component={screens.PrivacyPolicy}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='CardMenu'
        component={screens.CardMenu}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='CardDetails'
        component={screens.CardDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ChangePinCode'
        component={screens.ChangePinCode}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Payments'
        component={screens.Payments}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='MobilePayment'
        component={screens.MobilePayment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='FundTransfer'
        component={screens.FundTransfer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='IBANPayment'
        component={screens.IBANPayment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='TransactionDetails'
        component={screens.TransactionDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='PaymentSuccess'
        component={screens.PaymentSuccess}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='PaymentFailed'
        component={screens.PaymentFailed}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='SignUpAccountCreated'
        component={screens.SignUpAccountCreated}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='SignInCode'
        component={screens.SignInCode}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ForgotPassword'
        component={screens.ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='NewPassword'
        component={screens.NewPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ForgotPasswordSentEmail'
        component={screens.ForgotPasswordSentEmail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ConfirmationCode'
        component={screens.ConfirmationCode}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ExchangeRates'
        component={screens.ExchangeRates}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='OpenNewLoan'
        component={screens.OpenNewLoan}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='TopUpPayment'
        component={screens.TopUpPayment}
        options={{headerShown: false}}
      />
       <Stack.Screen 
      name='Webview' 
      component={Webview} 
      options={{headerShown: false}} />
      
      <Stack.Screen 
      name='CRM' 
      component={CRM} 
      options={{headerShown: false}} />
      <Stack.Screen 
        name='HRM'
        component={HRM} 
        options={{headerShown: false}} />
      <Stack.Screen
        name='Modules'
        component={Modules}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='MyComponent'
        component={MyComponent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='ACCOUNT'
        component={ACCOUNT}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Mode'
        component={Mode}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Dashboard'
        component={Dashboard}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name='AttendanceRecord'
        component={AttendanceRecord}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='TimeSheet'
        component={TimeSheet}
        options={{headerShown: false}}
      />
        <Stack.Screen
        name='AnalogClock'
        component={AnalogClock}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Task'
        component={Task}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name='MyJobs'
        component={MyJobs}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
