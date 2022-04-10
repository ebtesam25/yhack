import React, {Component, useEffect, useState} from 'react';
import {View, Incubator, Text, Button, ActionBar} from 'react-native-ui-lib';
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

export default function FlightInfo({route}) {

    const navigation = useNavigation();
    
    const {flight} = route.params;

    const [delayed, setdelayed] = useState('');
    const [airlines, setairlines] = useState('');
    const [origin, setorigin] = useState('');
    const [destination, setdestination] = useState('');
    const [historicDelay, sethistoricDelay] = useState('');
    const [arrivalEst, setarrivalEst] = useState('')
    const [eligibility, seteligibility] = useState('');
    const [risk, setrisk] = useState('');
    const [result, setResult] = useState({"requests": [{"id": "2", "code": "NK1210", "delay": 1, "histdelay": 2, "preddelay": 2, "origin": "DCA", "destination":
    "MCO", "arrival": "11", "predictedarrival": "14", "autoclaim": "eligible", "risk": "0.2", "airline": "Spirit"}]});

    const data = {
        labels: ["Delay", "Estimated Delay"],
        datasets: [
          {
            data: [result.requests[0].delay,result.requests[0].histdelay]
          }
        ]
      };


    const _getFlightInfo = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "action": "getflightinfo",
        "code": "NK1210"
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("https://us-central1-aiot-fit-xlab.cloudfunctions.net/ponderers", requestOptions)
        .then(response => response.json())
        .then(result => {console.log(result); setResult(result)})
        .catch(error => console.log('error', error));
    }

    useEffect(() => {
        _getFlightInfo();
        
    }, [])

    return (
      <View flex>
          <View background-blue10 height={80} style={{borderBottomEndRadius:10, borderBottomStartRadius:10}}>
          <Text white center marginT-30 style={{fontWeight:'bold', fontSize:20, textAlignVertical:'center'}}>Flight Information</Text>
          </View>
            <View marginV-20>
            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                <Text style={{fontWeight:'bold', textAlign:'center'}}>{flight}</Text>
            <Text style={{fontWeight:'bold', textAlign:'center'}}>{new Date(Date.now()).getDate()}/{new Date(Date.now()).getMonth()}/{new Date(Date.now()).getFullYear()}</Text>
                </View>
                <Text style={{width:'80%', fontWeight:'500', textAlign:'left', alignSelf:'center', fontSize:15}}>
                According to the airlines, your flight is delayed by {result.requests[0].delay} hour(s),
                but based on flights this week in
                April on {result.requests[0].airline} from {result.origin} to {result.requests[0].destination}, your flight is likely to
                arrive {result.requests[0].preddelay} hour(s) late at {result.requests[0].predictedarrival}:00.
                {"\n"}
                This flight would {result.requests[0].autoclaim=="eligible"?"":"not"} be eligible for a an
                auto-claim.
                {"\n"}
                {historicDelay>3&&<Text style={{fontWeight:'bold', color:"red"}}>There is a {risk}% risk of a 3+ hour delay. Travel Insurance Recommended</Text>}
                </Text>


                <View style={{alignSelf:'center', marginTop:'10%'}}><BarChart
                    style={{width:'50%'}}
                    data={data}
                    width={250}
                    height={350}
                    chartConfig={{
                        backgroundColor: "#FFF",
                        backgroundGradientFrom: "#FFF",
                        backgroundGradientTo: "#FFF",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                          borderRadius: 16
                        },
                        propsForDots: {
                          r: "6",
                          strokeWidth: "2",
                          stroke: "#ffa726"
                        }
                      }}
                      
                    verticalLabelRotation={0}
                    /></View>
            </View>
       
        <View marginT-100 center>
          <Button onPress={()=>navigation.navigate('AddContract',{flight:flight})} text70 white background-blue10 style={{width:'70%'}} borderRadius={5} labelStyle={{fontWeight:'bold'}} label="Insure My Trip"/>
        </View>
      </View>
    );
}