import React, {useContext} from 'react';
import { StyleSheet,  ScrollView, Text, TextInput, 
    TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { globalStyles } from '../styles/globalStyles';
import StateContext from './StateContext';

import { 
    // for email/password authentication: 
    createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification,
    // for logging out:
    signOut
} from "firebase/auth";
import { 
    // access to Firestore storage features:
    // for storage access
    collection, doc, setDoc,
    query, where, getDocs
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

export default function SignupScreen(props) {
    const stateProps = useContext(StateContext);
    const auth = stateProps.auth;
    const db = stateProps.db; 
    
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMsg, setErrorMsg] = React.useState(''); 

    async function isProfileInFirebase(email) {
        const q = query(collection(db, "profiles"), where("email", "==", email)); 
        const querySnapshot = await getDocs(q);
        let profiles = []; 
        if (!querySnapshot.empty) {
          querySnapshot.forEach(doc => {
            profiles.push(doc);
          });
        }
        console.log("Coming from is profile in firebase", email, profiles); 
        if (profiles.length > 0) {
          console.log("Profile was found."); 
          return true; 
        }
        console.log("Profile was not found"); 
        return false; 
      }
  
  
    async function firebasePostNewProfile() {
        if (errorMsg !== '') {
            return;
        }
        let bool = await(isProfileInFirebase(email)); 
        console.log("Is profile in database?", bool); 
        // If the profile with the specified email is not in Firebase
        if (!bool) {
            // Create a new empty profile 
            console.log(email);
            const profileRef = doc(db, 'profiles', email.toLowerCase());
            setDoc(profileRef, {
                email: email.toLowerCase(), 
                profilePicUri: 'https://picsum.photos/700',
                basics: {
                    name: name, 
                    pronouns: '', 
                    bio: '',        
                }, 
                personal: {
                    classYear: '', 
                    major: '', 
                    minor: '', 
                    hometown: '', 
                    residenceHall: '',
                    clubs: '',
                    hobbies: '',
                    favPlaceOnCampus: '',
                    favWellesleyMemory: '',
                }, 
                academics: {
                    currentClasses: '', 
                    plannedClasses: '', 
                    favClasses: '', 
                    studyAbroad: '', 
                }, 
                career: {
                    interestedIndustry: '', 
                    jobExp: '', 
                    internshipExp: '', 
                }, 
                messageContacts: [], 
              }
            );
        }
        console.log("Set new profile!", formatJSON(email)); 
    }

    function signUpUserEmailPassword() {
        if (auth.currentUser) {
            signOut(auth); // sign out auth's current user (who is not loggedInUser, 
                           // or else we wouldn't be here
        }
        if (name.length < 1) {
            setErrorMsg('No name entered');
            return;
        }
        if (!email.includes('@wellesley.edu')) {
            setErrorMsg('Not a valid Wellesley email address');
            return;
        }
        if (password.length < 6) {
            setErrorMsg('Password too short');
            return;
        }   
        // Invoke Firebase authentication API for Email/Password sign up 
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(`signUpUserEmailPassword: sign up for email ${email} succeeded (but email still needs verification).`);

            // Clear name/email/password inputs
            const savedEmail = email; // Save for email verification
            setName('');
            setEmail('');
            setPassword('');

            // Note: could store userCredential here if wanted it later ...
            // console.log(`createUserWithEmailAndPassword: setCredential`);
            // setCredential(userCredential);

            // Send verication email
            console.log('signUpUserEmailPassword: about to send verification email');
            sendEmailVerification(auth.currentUser)
            .then(() => {
                console.log('signUpUserEmailPassword: sent verification email');
                setErrorMsg(`A verification email has been sent to ${savedEmail}. You will not be able to sign in to this account until you click on the verification link in that email.`); 
                // Email verification sent!
                // ...
            });
        })
        .catch((error) => {
            console.log(`signUpUserEmailPassword: sign up failed for email ${email}`);
            const errorMessage = error.message;
            // const errorCode = error.code; // Could use this, too.
            console.log(`createUserWithEmailAndPassword: ${errorMessage}`);
            setErrorMsg(`createUserWithEmailAndPassword: ${errorMessage}`);
        });
        // alert("Got here!"); 
        firebasePostNewProfile(); 
    }

    return (
        <ScrollView style={{flex: 1, paddingTop: 80, paddingBottom: 20}}>
            <View style={{
                backgroundColor: '#FFD34F', 
                opacity: .8, 
                borderRadius: 20,
                paddingTop: 30,
                width: '85%',
                alignSelf: 'center',
                marginBottom: 10,
                shadowColor: 'grey',
                shadowOffset: {width: 0,height: 4},
                shadowOpacity: .8,
                }}>
                <Text style={globalStyles.signInUpBoxTitle}>Create An Account</Text>
                <View style={globalStyles.userInfoSection}>
                    <View style={styles.labeledInput}>
                    <Text style={globalStyles.signInUpText}>Name:</Text>
                    <TextInput placeholder="Enter your name" 
                        style={globalStyles.signInUpTextInput} 
                        value={name} 
                        onChangeText={ textVal => setName(textVal)} />
                    </View>
                    <View style={styles.labeledInput}>
                    <Text style={globalStyles.signInUpText}>Email:</Text>
                    <TextInput placeholder="Enter your email" 
                        style={globalStyles.signInUpTextInput} 
                        value={email} 
                        onChangeText={ textVal => setEmail(textVal)} />
                    </View>
                    <View style={styles.labeledInput}>
                    <Text style={globalStyles.signInUpText}>Password:</Text>
                    <TextInput placeholder="Enter a password" 
                        style={globalStyles.signInUpTextInput} 
                        value={password} 
                        onChangeText={ textVal => setPassword(textVal)} />
                    </View>
                </View>
            </View>
            <View style={globalStyles.userInfoSection}>
                <TouchableOpacity onPress={() => signUpUserEmailPassword()} 
                    style={[globalStyles.signupButton, {shadowColor: 'grey',
                    shadowOffset: {width: 0,height: 1}, shadowOpacity: .5,}]}>
                    <Text style={globalStyles.welcomeText}>SIGN UP</Text>
                </TouchableOpacity>
            </View>
            <View style={errorMsg === '' ? styles.hidden : styles.errorBox}>
                <Text style={styles.errorMessage}>{errorMsg}</Text>
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
    visible: {
        display: 'flex',
    },
    jsonContainer: {
        flex: 1,
        width: '98%',
        borderWidth: 1,
        borderStyle: 'dashed', // Lyn sez: doesn't seem to work 
        borderColor: 'blue',
    },
    json: {
        padding: 10, 
        color: 'blue', 
    },
});