import React, {useState, useEffect} from "react";
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'DMSans_700Bold',

  },
  caption: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '500',
    fontFamily: 'DMSans_400Regular',

  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: 175,
    elevation: 3,
    backgroundColor: '#5971B5',
    marginTop: 15,
    alignSelf: 'center',
  },
  signupButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: 175,
    elevation: 3,
    backgroundColor: '#FFD34F',
    marginTop: 15,
    alignSelf: 'center',
  },
  welcomeText: {
    fontFamily: 'RobotoMono_500Medium',
    fontSize: 20,
    color: 'white',
    letterSpacing: 1,
  },
  signInUpBoxTitle: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 20,
    color: 'white',
    letterSpacing: 0.8,
    marginLeft: 30,
    marginBottom: 30,
  },
  signInUpText: {
    fontFamily: 'RobotoMono_500Medium',
    fontSize: 18,
    color: 'black',
    letterSpacing: 1,
    marginBottom: 5,
  },
  signInUpTextInput: {
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 16,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 20,
    margin: 'auto',
  },
  searchbar: {
    shadowOpacity: 0, 
    marginBottom: 10,
    borderRadius: 15,
  },
  sortDropDown: {
    borderColor: '#5971B5', 
    fontFamily: 'DMSans_500Medium',
    backgroundColor: '#5971B5',
    borderRadius: 15,
  },
  cardName: {
    fontFamily: 'DMSans_500Medium',
    marginBottom: 5
  },
  cardText: {
    fontFamily: 'DMSans_400Regular',
  },
  editProfileButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: '#5971B5', 
    backgroundColor: '#5971B5',
    borderRadius: 15,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontFamily: 'DMSans_700Bold',
    letterSpacing: 1,
    fontSize: 15,

  },
  infoField: {
    flexDirection: 'row', 
    // justifyContent: 'space-around',
    // borderWidth: 1,
    // borderColor: 'red',
    marginBottom: 15,
    // height: 45,
  },
  profileText: {
    flex: 1,
    alignSelf: 'center',
    paddingLeft: 20,
    fontSize: 15,
    color: 'black',
    fontFamily: 'RobotoMono_500Medium',

  },
  profileField: {
    flexDirection: 'row', 
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    marginBottom: 20,
  },
  textType: {
    flex: 0.6,
    alignSelf: 'center',
    marginVertical: 'auto',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'DMSans_500Medium',
  },
  textInput: {
    flex: 1,
    alignSelf: 'center',
    paddingLeft: 20,
    fontSize: 15,
    color: 'grey',
    fontFamily: 'RobotoMono_500Medium',
  },
  submitButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#5971B5',
    marginTop: 25,
  },
  favName: {
    fontFamily: 'DMSans_500Medium', 
    fontSize: 18,
    letterSpacing: 1,
  },
  favText: {
    fontFamily: 'DMSans_400Regular', 
    fontSize: 14,
    letterSpacing: 1,
  },
  messageName: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 20,
    marginLeft: 20
  },
  senderMessageBox: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#5971B5', 
    padding: 15, 
    marginLeft: 40
  },
  receipentMessageBox: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#FFF', 
    padding: 15,
    marginRight: 40
  },
  senderText: {
    color: '#FFF', 
    fontFamily: 'RobotoMono_500Medium', 
    marginBottom: 5,
  },
  receipentText: {
    color: '#000', 
    fontFamily: 'RobotoMono_500Medium', 
    marginBottom: 5
  },
  messageInput: {
    flex: 1,
    padding: 10,
    backgroundColor: 'lightgrey',
    borderRadius: 20
  },
  hidden: {
      display: 'none',
  },
});