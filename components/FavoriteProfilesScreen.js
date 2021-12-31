import React, {useContext, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList, LogBox } from 'react-native';
import Constants from 'expo-constants';
import { setStatusBarNetworkActivityIndicatorVisible, StatusBar } from 'expo-status-bar';
//import {Picker} from '@react-native-picker/picker';
import { Avatar, Card, List, Title, Paragraph, Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { globalStyles } from '../styles/globalStyles';
import StateContext from './StateContext'; 
import { 
    // access to Firestore storage features:
    // for storage access
    collection, doc, addDoc, setDoc,
    query, where, getDoc, getDocs
} from "firebase/firestore";

function formatJSON(jsonVal) {
    return JSON.stringify(jsonVal, null, 2);
}

export default function FavoriteProfilesScreen({ navigation }) {
    const stateProps = useContext(StateContext);
    const db = stateProps.db;
    const userProfileDoc = stateProps.userProfileDoc; 
    const userEmail = userProfileDoc.email; 
    const [favorites, setFavorites] = useState([]);

    // Get user's contacts when Favorite Profiles screen mounts

    useEffect(() => {
        firebaseGetFavorites();
        // setFavorites(userProfileDoc.favorites); 
    }, []);

    async function firebaseGetFavorites() {
        const docRef = doc(db, "favorites", userEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Favorite profiles data:", docSnap.data());
            const favoritesDoc = docSnap.data().favorite;
            const favoriteProfiles = [];
            favoritesDoc.map(field => {
                favoriteProfiles.push(field);
            });
            setFavorites(favoriteProfiles);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
}
    }

    return (
    <ScrollView style={{backgroundColor: '#FFF0BB'}}>
        <SafeAreaView>
            <View>
                <Searchbar
                    style={[globalStyles.searchbar, {marginTop: 10, marginHorizontal: 10}]}
                    placeholder="Search"
                    // onChangeText={onChangeSearch}
                    // value={searchQuery}
                />
                
                {favorites.length ? (favorites.map( (user) => {
                    return (
                        <TouchableOpacity key={user.email}
                            onPress={() => navigation.navigate('Explore Stack', 
                                { screen: 'Explore Profile', params: { userEmail: user.email }})}
                            style={{ flexDirection: 'row', 
                                paddingHorizontal: 20, paddingVertical: 10, 
                                borderBottomWidth: 1, borderBottomColor: 'lightgrey'}}>
                            <Avatar.Image 
                                style={{alignSelf: 'center', marginVertical: 10}}
                                size={75}
                                source={{
                                    uri: user.profilePicUri
                                }} 
                            />
                            <View
                                style={{ flex: 1, marginHorizontal: 20, 
                                    justifyContent: 'center'}}>
                                <Text style={globalStyles.favName}>{user.name}</Text>
                                <Text style={{fontFamily: 'DMSans_400Regular_Italic', fontSize: 14,
                                    letterSpacing: 1}}>{user.pronouns}</Text>
                                <Text style={globalStyles.favText}>{user.email}</Text>
                                <Text style={[globalStyles.favText, {marginTop: 5}]}>"{user.bio}"</Text>
                            </View>
                            <TouchableOpacity
                                style={{justifyContent: 'center', flex: .175}}>
                                <Icon  name="heart" color="#ef476f" size={25}/>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    );
                })): <View></View>}
            </View>
        </SafeAreaView>
    </ScrollView>
    );
}

