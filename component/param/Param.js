import React, { Component } from 'react'
import { StyleSheet, View, Text, Button, TouchableOpacity, Image, WebView } from 'react-native'
// firebase
import base from '../base/base'
import { auth } from '../base/base'
import 'firebase/database'
import firebase from 'firebase/app'
import { storage } from '../base/base'
// syndicat
import syndicat from '../syndicat/Syndicat'
import ProfilModal from './ProfilModal'
import NotificationModal from './NotificationModal'


class Param extends Component {
    state = {
        // base usagers
        usagers: '',
        usagerId: '',
        // redirection
        redirectionUsager: false,
        // modal
        afficherProfilModal: false,
        modalId: '',
        afficherNotificationModal: false,
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

    // click usagers
    bouttonUsagers = () => {
        this.setState({ redirectionUsager: true })
    }

    // afficher modal profil
    openProfilModal = () => {
        const { usagerId } = this.state
        this.setState({ afficherProfilModal: true, modalId: usagerId })
    }

    // fermer modal profil
    closeProfilModal = () => {
        this.setState({ afficherProfilModal: false, modalId: '' })
    }

    // boutton notification
    openNotificationModal = () => {
        this.setState({ afficherNotificationModal: true })
    }

    closeNotificationModal = () => {
        this.setState({ afficherNotificationModal: false })
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref)
    }

    render () {
        const {
            // base usager
            usagers,
            usagerId,
            redirectionUsager,
            //
            modalId,
        } = this.state

        // redirection page usagers
        if (redirectionUsager) {
            this.props.navigation.navigate('Usagers')
        }

        // si admin
        let admin = false
        let recupadmin = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].admin)
        if (String(recupadmin) === 'true') {
            admin = true
        } 


        return (
            <View style={styles.mainView}>
                {admin?
                <TouchableOpacity
                    style={styles.textView}
                    onPress={this.bouttonUsagers}
                >
                    <Text style={styles.text}>Usagers</Text>
                </TouchableOpacity>
                :null}
                {admin?
                <TouchableOpacity
                    style={styles.textView}
                    onPress={this.openNotificationModal}
                >
                    <Text style={styles.text}>Notification</Text>
                </TouchableOpacity>
                :null}
                <TouchableOpacity
                    style={styles.textView}
                    onPress={this.openProfilModal}
                >
                    <Text style={styles.text}>Profil</Text>
                </TouchableOpacity>
                <ProfilModal
                        afficherProfilModal={this.state.afficherProfilModal}
                        bouttonPresser={this.closeProfilModal}
                        modalId={modalId}
                />
                <NotificationModal
                        afficherNotificationModal={this.state.afficherNotificationModal}
                        bouttonPresser={this.closeNotificationModal}
                />
            </View>
        )
    }
}

export default Param

const styles = StyleSheet.create({
    mainView: {
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 80,
    },
    textView: {
        borderBottomWidth: 2, 
        borderColor: 'yellow',
    },
    text: {
        marginTop: 10,
        marginBottom: 10,
    },
})
