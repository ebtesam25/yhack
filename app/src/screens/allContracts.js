import React, {Component, useEffect, useState} from 'react';
import {View, Incubator, Text, Button, ActionBar, Slider, Card} from 'react-native-ui-lib';
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
import { ScrollView } from 'react-native';

export default function Contracts({route}) {

    const navigation = useNavigation();

    const {userid} = route.params;
    

    const [contracts, setcontracts] = useState({"contracts": [{"id": "2", "flight": "NK1210", "amount": 150, "delay": 3, "premium": 7.5}, {"id": "3", "flight":
    "NK1210", "amount": 150, "delay": 3, "premium": 7.5}, {"id": "4", "flight": "NK1210", "amount": 444, "delay": 2,
    "premium": 0.0}]})

    const _getAllContracts = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "action": "getallcontractsbyuser",
        "userid": userid
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("https://us-central1-aiot-fit-xlab.cloudfunctions.net/ponderers", requestOptions)
        .then(response => response.json())
        .then(result => {console.log(result);setcontracts(result)})
        .catch(error => console.log('error', error));
    }

    useEffect(() => {
        _getAllContracts();
    }, [])


    return (
      <View flex>
          <View background-blue10 height={80} style={{borderBottomEndRadius:10, borderBottomStartRadius:10}}>
          <Text white center marginT-30 style={{fontWeight:'bold', fontSize:20, textAlignVertical:'center'}}>Contracts</Text>
          </View>
            <View marginV-20>
            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                </View>
     
                <View style={{height:700}}><ScrollView>
                    {contracts.contracts.map((c)=>(<View style={{marginHorizontal:'10%', marginVertical:'5%'}}>
                <Card><Card.Section
                content={[{text: `Flight No:${c.flight}`, text70: true, blue10: true}]}
                contentStyle={{alignItems: 'flex-start', margin:'2.5%'}}
                />
                <Card.Section
                content={[{text: `Amount: ${c.amount}`, text70: true, blue10: true}]}
                contentStyle={{alignItems: 'flex-start', margin:'2.5%'}}
                />
                <Card.Section
                content={[{text: `Delay: ${c.delay}`, text70: true, blue10: true}]}
                contentStyle={{alignItems: 'flex-start', margin:'2.5%'}}
                />
                <Card.Section
                content={[{text: `Premium: ${c.premium}`, text70: true, blue10: true}]}
                contentStyle={{alignItems: 'flex-start', margin:'2.5%'}}
                />
                </Card>
                </View>))}</ScrollView></View>
               
                

                
            </View>
       
       
      </View>
    );
}