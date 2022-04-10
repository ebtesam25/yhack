import React, {Component, useState} from 'react';
import {View, Incubator, Text, Button, ActionBar, Slider} from 'react-native-ui-lib';
import { TextInput } from 'react-native-paper';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";

export default function AddContract({route}) {

    const navigation = useNavigation();
    
    const {flight} = route.params;

    const [price, setprice] = useState('')
    const [hours, sethours] = useState('')
    const [premium, setpremium] = useState('');


    const _addContract = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "action": "addcontract",
        "flight": flight,
        "userid": "2",
        "delay": parseInt(hours),
        "amount": parseInt(price)
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("https://us-central1-aiot-fit-xlab.cloudfunctions.net/ponderers", requestOptions)
        .then(response => response.json())
        .then(result => {console.log(result);setpremium(result.premium)})
        .catch(error => console.log('error', error));
    }


    return (
      <View flex>
          <View background-blue10 height={80} style={{borderBottomEndRadius:10, borderBottomStartRadius:10}}>
          <Text white center marginT-30 style={{fontWeight:'bold', fontSize:20, textAlignVertical:'center'}}>Flight Insurance</Text>
          </View>
            <View marginV-20>
            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                <Text style={{fontWeight:'bold', textAlign:'center'}}>{flight}</Text>
                <Text style={{fontWeight:'bold', textAlign:'center'}}>{new Date(Date.now()).getDate()}/{new Date(Date.now()).getMonth()}/{new Date(Date.now()).getFullYear()}</Text>
                </View>
                <View style={{marginHorizontal:'10%', marginVertical:'20%'}}>
                <Text style={{fontWeight:'bold'}}>Hours:{hours}</Text>
                <Slider
                value={0}
                minimumValue={0}
                maximumValue={24}
                step={1}
                thumbTintColor={"#0c2f87"}
                onValueChange={(e) => sethours(e.toString()) }
                />
                </View>
                <View style={{marginHorizontal:'10%', marginBottom:'20%'}}>
                <Text style={{fontWeight:'bold'}}>Compensation:{price}</Text>
                <Slider
                value={0}
                minimumValue={0}
                maximumValue={1000}
                step={1}
                thumbTintColor={"#0c2f87"}
                onValueChange={(e) => setprice(e.toString()) }
                />
                </View>

                <View>
                <Text style={{fontWeight:'bold', fontSize:12, color:"#0c2f87", textAlign:'center'}}>PREMIUM</Text>
                    <Text style={{fontWeight:'bold', fontSize:40, color:"#0c2f87", textAlign:'center'}}>{premium}</Text></View>
                
            </View>
       
        <View marginT-100 center>
          <Button onPress={()=>{_addContract()}} text70 white background-blue10 style={{width:'70%'}} borderRadius={5} labelStyle={{fontWeight:'bold'}} label="Calculate Premium"/>
        </View>
        <View marginT-10 center>
          <Button onPress={()=>navigation.navigate('Contracts')} text70 white background-green40 style={{width:'70%'}} borderRadius={5} labelStyle={{fontWeight:'bold'}} label="Purchase"/>
        </View>
      </View>
    );
}