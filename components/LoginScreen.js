import React, { useContext, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Text, TextInput, 
    TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { globalStyles } from "../styles/globalStyles";
import StateContext from './StateContext';

import { 
    // for email/password authentication: 
    signInWithEmailAndPassword,
  } from "firebase/auth";
import { 
    // for storage access
    doc, getDoc
} from "firebase/firestore";

function formatJSON(jsonVal) {
  return JSON.stringify(jsonVal, null, 2);
}

function emailOf(user) {
    if (user) {
        return user.email;
    } else {
        return null;
    }
}

export default function LoginScreen(props) {
    const stateProps = useContext(StateContext);
    const auth = stateProps.auth;
    const db = stateProps.db;

    const loggedInUser = stateProps.loggedInUser; 
    const setLoggedInUser = stateProps.setLoggedInUser; 
    const userProfileDoc = stateProps.userProfileDoc; 
    const setUserProfileDoc = stateProps.setUserProfileDoc; 

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMsg, setErrorMsg] = React.useState(''); 

    // Usually, React only does an update to the state if it causes something to change (i.e. the render to change)
    // UseEffect says: if userProfileDoc ever changes, you better execute this effect before you go to the Explore page
    useEffect(() => {
      //console.log("userProfileDoc", userProfileDoc); 
      if (userProfileDoc) { 
        props.navigation.navigate("Friendsley"); 

      }
    }, [userProfileDoc]); // When userProfileDoc changes, this effect is triggered 
    // Download all the data of the current user once they are successfully logged in (right before call to navigate to Explore screen) - local database will be one of the StateProps (ex stateProps.setLoggedInUser('VALUE'))
    // However, download messages from Firestore every 5-10 minutes (are there messages sooner than this timestamp about me)
    

    /* Receive and set logged-in user's profile from Firebase into stateProps */
    async function firebaseGetUserProfile(email) {
      const docRef = doc(db, "profiles", email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        let userDoc = docSnap.data();

        return userDoc;
        // setUserProfileDoc(userDoc); 
        // console.log("Set userProfileDoc to:", formatJSON(userProfileDoc));
      } else {
        // doc.data() will be undefined in this case
        console.log("No such profile document!");
      }

  }

    function signInUserEmailPassword() {
        console.log('called signInUserEmailPassword');
        console.log(`signInUserEmailPassword: emailOf(currentUser)0=${emailOf(auth.currentUser)}`); 
        console.log(`signInUserEmailPassword: emailOf(loggedInUser)0=${emailOf(loggedInUser)}`); 
        // Invoke Firebase authentication API for Email/Password sign in 
        // Use Email/Password for authentication 
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            console.log(`signInUserEmailPassword succeeded for email ${email}; have userCredential for emailOf(auth.currentUser)=${emailOf(auth.currentUser)} (but may not be verified)`); 
            console.log(`signInUserEmailPassword: emailOf(currentUser)1=${emailOf(auth.currentUser)}`); 
            console.log(`signInUserEmailPassword: emailOf(loggedInUser)1=${emailOf(loggedInUser)}`); 
    
            // Only log in auth.currentUser if their email is verified
            checkEmailVerification();

            console.log(auth.currentUser.email);
            // Set logged-in user's profile in stateProps
            firebaseGetUserProfile(auth.currentUser.email.toLowerCase()).then( (value) => {
              setUserProfileDoc(value);
            })
            //.catch(e => console.log(e));
            //});
            
            // Clear email/password inputs 
            setEmail('');
            setPassword('');
    
            // Note: could store userCredential here if wanted it later ...
            // console.log(`createUserWithEmailAndPassword: setCredential`);
            // setCredential(userCredential);
        
            })
            .catch((error) => {
              console.log(`signUpUserEmailPassword: sign in failed for email ${email}`);
              const errorMessage = error.message;
              // const errorCode = error.code; // Could use this, too.
              console.log(`signInUserEmailPassword: ${errorMessage}`);
              setErrorMsg(`signInUserEmailPassword: ${errorMessage}`);
          });
    }

    function checkEmailVerification() {
        if (auth.currentUser) {
          console.log(`checkEmailVerification: auth.currentUser.emailVerified=${auth.currentUser.emailVerified}`);
          if (auth.currentUser.emailVerified) {
            console.log(`checkEmailVerification: setLoggedInUser for ${auth.currentUser.email}`);
            setLoggedInUser(auth.currentUser.email);
            console.log('auth.currentUser:', formatJSON(auth.currentUser));
            console.log('loggedInUser:', formatJSON(loggedInUser));
            console.log("checkEmailVerification: setErrorMsg('')")
            setErrorMsg('')
          } else {
            console.log('checkEmailVerification: remind user to verify email');
            setErrorMsg(`You cannot sign in as ${auth.currentUser.email} until you verify that this is your email address. You can verify this email address by clicking on the link in a verification email sent by this app to ${auth.currentUser.email}.`)
          }
        }
    }

    return (
        <ScrollView style={{flex: 1, paddingTop: 100, paddingBottom: 20}}>
          <StatusBar style="auto" />
          <View>
            <View style={{
              backgroundColor: '#5971B5', 
              opacity: .8, 
              borderRadius: 20,
              paddingTop: 30,
              width: '85%',
              alignSelf: 'center',
              marginBottom: 10,
              shadowColor: 'grey',
              shadowOffset: {width: 0,height: 5},
              shadowOpacity: .8,
            }}>
              <Text style={globalStyles.signInUpBoxTitle}>Sign Into Friendsley</Text>
              <View style={globalStyles.userInfoSection}>
                <View style={styles.labeledInput}>
                  <Text style={globalStyles.signInUpText}>Email:</Text>
                  <TextInput placeholder="Enter your email" 
                    style={globalStyles.signInUpTextInput} 
                    value={email} 
                    onChangeText={ textVal => setEmail(textVal)} />
                </View>
                <View style={styles.labeledInput}>
                  <Text style={globalStyles.signInUpText}>Password:</Text>
                  <TextInput placeholder="Enter your password" 
                    style={globalStyles.signInUpTextInput} 
                    value={password} 
                    onChangeText={ textVal => setPassword(textVal)} />
                </View>
              </View>
            </View>
            <View style={globalStyles.userInfoSection}>
              <TouchableOpacity style={[globalStyles.loginButton, {shadowColor: 'grey',
                      shadowOffset: {width: 0,height: 3}, shadowOpacity: .5}]}
                onPress={() => signInUserEmailPassword()}>
                <Text style={globalStyles.welcomeText}>LOGIN</Text>
              </TouchableOpacity> 
            </View>
            <View style={errorMsg === '' ? styles.hidden : styles.errorBox}>
              <Text style={styles.errorMessage}>{errorMsg}</Text>
            </View>
          </View>
        </ScrollView>
      );
    }
    
    const styles = StyleSheet.create({
    labeledInput: {
        width: "100%",
        justifyContent: 'center',
    }, 
    errorBox: {
        width: '80%',
        borderWidth: 1,
        borderStyle: 'dashed', // Lyn sez: doesn't seem to work 
        borderColor: 'red',
        alignSelf: 'center'
    },
    errorMessage: {
        color: 'red',
        padding: 10, 
    },
    hidden: {
        display: 'none',
    },
    jsonContainer: {
        flex: 1,
        width: '80%',
        borderWidth: 1,
        borderStyle: 'dashed', // Lyn sez: doesn't seem to work 
        borderColor: 'blue',
        alignSelf: 'center'
    },
    json: {
        padding: 10, 
        color: 'blue', 
    },
});
