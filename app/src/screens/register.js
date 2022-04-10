import React, {Component, useState} from 'react';
import {View, Incubator, Text, Button, ActionBar} from 'react-native-ui-lib';
import { TextInput } from 'react-native-paper';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';

export default function Register() {

    const navigation = useNavigation();

    const [email, setemail] = useState('');
    const [pass, setpass] = useState('');
    const [name, setname] = useState('');
    const [phone, setphone] = useState('');

    const _registerUser = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "action": "register",
        "name": name,
        "email": email,
        "phone": phone,
        "password": pass
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("https://us-central1-aiot-fit-xlab.cloudfunctions.net/ponderers", requestOptions)
        .then(response => response.json())
        .then(result => {console.log(result); navigation.navigate('Home')})
        .catch(error => console.log('error', error));
    }
    return (
      <View flex>
          <View background-blue10 height={80} style={{borderBottomEndRadius:10, borderBottomStartRadius:10}}>
          <Text white center marginT-30 style={{fontWeight:'bold', fontSize:20, textAlignVertical:'center'}}>Register</Text>
          </View>
            <View marginV-100>
                <Image source={{uri:'https://img.icons8.com/cotton/100/000000/around-the-globe--v2.png'}} style={{width:100, height:100, alignSelf:'center'}}></Image>
            </View>



            <TextInput
            label="Full Name"
            mode="outlined"
            style={{width:'70%', alignSelf:'center'}}
            value={name}
            outlineColor={"#0c2f87"}
            activeOutlineColor={"#0c2f87"}
            onChangeText={text => setname(text)}
            />
            <TextInput
            label="Email"
            mode="outlined"
            style={{width:'70%', alignSelf:'center'}}
            value={email}
            outlineColor={"#0c2f87"}
            activeOutlineColor={"#0c2f87"}
            onChangeText={text => setemail(text)}
            />
            <TextInput
            label="Phone"
            mode="outlined"
            style={{width:'70%', alignSelf:'center'}}
            value={phone}
            outlineColor={"#0c2f87"}
            activeOutlineColor={"#0c2f87"}
            onChangeText={text => setphone(text)}
            />
            <TextInput
            label="Password"
            mode="outlined"
            style={{width:'70%', alignSelf:'center'}}
            value={pass}
            outlineColor={"#0c2f87"}
            activeOutlineColor={"#0c2f87"}
            secureTextEntry
            onChangeText={text => setpass(text)}
            />
       
        <View marginT-100 center>
          <Button onPress={()=>_registerUser()} text70 white background-blue10 style={{width:'70%'}} borderRadius={5} labelStyle={{fontWeight:'bold'}} label="Register"/>
        </View>
      </View>
    );
}