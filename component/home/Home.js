import React, { Component } from 'react'
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native'
// firebase
import 'firebase/auth'
import 'firebase/database'
import { auth } from '../base/base'



class Home extends Component {
  state = {
    connecter: true,
  }

  // si connecté ?
  componentDidMount () {
    auth.onAuthStateChanged(user => {
        if (user) {
          this.setState({ connecter:true })
        } else {
            this.setState({ connecter: false })
        }
    })
  }

    render () {
      if (!this.state.connecter) {
        this.props.navigation.navigate('Connexion')
      }
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../assets/fondecrancgt.jpeg')}
                                 style={{width: '100%', height: '100%'}}>
                    <View style={styles.header}>
                        <View style={styles.headerLogo}>
                            <Image style={styles.logo} 
                                   source={require('../assets/lacgt.png')} />
                        </View>
                        <View style={styles.headerName} >
                            <Text style={styles.syndicatNom}>Nom du syndicat</Text>
                            <Text style={styles.syndicatNom}>Ville du syndicat</Text>
                        </View>
                    </View>
                    <View style={styles.body}>
                        <View style={styles.bodyRow}>
                            <TouchableOpacity style={styles.iconBox} onPress={() => {this.props.navigation.navigate('Tract')}} >
                                <Image style={styles.icon} source={require('../assets/tractbtn.png')} />
                                <Text style={styles.textIcon}>TRACT</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBox} onPress={() => {this.props.navigation.navigate('Info')}} >
                                <Image style={styles.icon} source={require('../assets/info.png')} />
                                <Text style={styles.textIcon}>INFO</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBox} onPress={() => {this.props.navigation.navigate('Equipe')}} >
                                <Image style={styles.icon} source={require('../assets/equipebtn.png')} />
                                <Text style={styles.textIcon}>EQUIPE</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bodyRow}>
                            <TouchableOpacity style={styles.iconBox} onPress={() => {this.props.navigation.navigate('Contact')}} >
                                <Image style={styles.icon} source={require('../assets/contactbtn.png')} />
                                <Text style={styles.textIcon}>CONTACT</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBox} onPress={() => {this.props.navigation.navigate('Forum')}} >
                                <Image style={styles.icon} source={require('../assets/chat2.png')} />
                                <Text style={styles.textIcon}>FORUM</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBox} onPress={() => {this.props.navigation.navigate('Param')}} >
                                <Image style={styles.icon} source={require('../assets/params.png')} />
                                <Text style={styles.textIcon}>PARAM</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bodyRow}>
                          <TouchableOpacity style={styles.iconBox} >
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.iconBox} onPress={() => {this.props.navigation.navigate('Connexion')}} >
                            <Image style={styles.icon} source={require('../assets/login.png')} />
                            <Text style={styles.textIcon}>LOGIN</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.iconBox}  >
                          </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}

export default Home

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
    },
    header: {
      flex: 1,
      flexDirection: 'row',
      marginTop: 10
    },
    headerLogo: {
      flex: 1
    },
    logo: {
      flex: 1,
      width: null,
      height: null,
      resizeMode: 'contain'
    },
    headerName: {
      flex: 2,
      marginTop: 10
    },
    syndicatNom: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center'
    },
    body: {
      flex: 5,
      marginTop: 0
    },
    bodyRow: {
      flex: 1,
      flexDirection: 'row',
      marginLeft: 10,
      marginRight: 10
    },
    iconBox: {
        flex: 1,
        marginLeft: 15,
        marginRight: 15
    },
    icon: {
      flex: 5,
      width: null,
      height: null,
      resizeMode: 'contain'
    },
    textIcon: {
      flex: 1,
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: -25
    }
  })

  