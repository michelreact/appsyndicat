import React, { Component } from 'react'
import { StyleSheet, View, Text, Button, TouchableOpacity, Image, WebView, Linking } from 'react-native'
// firebase
import base from '../base/base'
import { auth } from '../base/base'
import 'firebase/database'
import firebase from 'firebase/app'
import { storage } from '../base/base'
// syndicat
import syndicat from '../syndicat/Syndicat'
import { syndicatMail } from '../syndicat/Syndicat'
// elements
import TitreRouge from '../elements/TitreRouge'

class Contact extends Component {
    state={
        // base usagers
        usagers: '',
        usagerId: '',
        // redirection
        redirectConnexion: false,
    }

    // au montage
    componentDidMount () {

        // connecter base usagers
        this.ref = base.syncState(syndicat+'/usagers',{
            context: this,
            state: 'usagers'
        })

        // Si Authentifier
        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({ usagerId: user.uid, redirectConnexion:false })
            } else {
              this.setState({ redirectConnexion:true })
            }
        })
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref)
    }


    render () {

        const { redirectConnexion, usagers, usagerId } = this.state

        // si pas identifier redirection page connexion 
        if (redirectConnexion) {
            this.props.navigation.navigate('Connexion')
        }

        // si adherent
        let adherent = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].adherent)
        if (String(adherent) === 'false') {
            return <Text>Tu dois être adherent pour consulter cette page</Text>
        }

        return (
            <View style={styles.mainView}>
                <Text></Text>
                <Text>Nous ecrire</Text>
                <Text></Text>
                { /* BOUTTON ECRIRE UN MAIL */ }
                <TouchableOpacity
                    onPress={() => Linking.openURL('mailto:'+syndicatMail) }
                >
                    <TitreRouge titre ={syndicatMail}/>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Contact

const styles = StyleSheet.create({
    mainView: {
        marginLeft: 30,
        marginRight: 30,
    },
})