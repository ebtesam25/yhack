
import React, {Component, useState} from 'react';
import {View, Incubator, Text, Button, ActionBar} from 'react-native-ui-lib';
import { TextInput } from 'react-native-paper';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';

export default function Home({route}) {

    const navigation = useNavigation();

    const [flight, setflight] = useState('');
    const {userid} = route.params;
    return (
      <View flex>
            <View marginV-50>
                <Image source={{uri:"https://img.icons8.com/external-flaticons-flat-flat-icons/256/000000/external-traveler-vacation-planning-solo-trip-flaticons-flat-flat-icons-2.png"}} style={{width:256, height:256, alignSelf:'center'}}></Image>
            </View>

            <Text style={{width:'80%', textAlign:'center', alignSelf:'center', color:"#0c2f87", fontSize:16, fontWeight:'600'}}>Your time is valuable. Enter your flight details to see if your delay is eligible for compensation. If eligible, it will be sent to you by the time you reach your gate, making sure you have the extra funding to make more out of a shorter trip.</Text>



            
            <TextInput
            label="Flight No."
            mode="outlined"
            style={{width:'70%', alignSelf:'center', marginTop:'25%'}}
            value={flight}
            outlineColor={"#0c2f87"}
            activeOutlineColor={"#0c2f87"}
            secureTextEntry
            onChangeText={text => setflight(text)}
            />
        <View marginT-10 center>
          <Button onPress={()=>navigation.navigate('FlightInfo',{flight:flight,userid:userid})} text70 white background-blue10 style={{width:'70%'}} borderRadius={5} labelStyle={{fontWeight:'bold'}} label="Check"/>
        </View>
      </View>
    );
}