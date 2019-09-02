import React, { Component } from 'react'
import { StyleSheet, View, Text, Button, TouchableOpacity, Image, WebView, ScrollView, Alert } from 'react-native'
// firebase
import base from '../base/base'
import { auth } from '../base/base'
import 'firebase/database'
import firebase from 'firebase/app'
import { storage } from '../base/base'
// syndicat
import syndicat from '../syndicat/Syndicat'
import ForumSujetModal from './ForumSujetModal'
import ForumSingleModal from './ForumSingleModal'
import ForumNewSujetModal from './ForumNewSujetModal'
import TitreRouge from '../elements/TitreRouge';

class Forum extends Component {
    state = {
        // base usagers
        usagers: '',
        usagerId: '',
        // base forums
        forums: '',
        sujet: '',
        message: '',
        messageRetour: '',
        forumId: '',
        // redirection
        redirectConnexion: false,
        redirectionHome: false,
        // modal
        afficherSujetModal: false,
        afficherSingleModal: false,
        afficherNewSujetModal: false,
    }

    // au montage
    componentDidMount () {

        // connecter base usagers
        this.ref = base.syncState(syndicat+'/usagers',{
            context: this,
            state: 'usagers'
        })

        // connecter base tracts
        this.ref2 = base.syncState(syndicat+'/forums',{
            context: this,
            state: 'forums'
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

    // open single modal
    openSingleModal = (id, sujet) => {
        this.setState({ afficherSingleModal: true, sujet: sujet, forumId: id })
    }

    // close single modal
    closeSingleModal = () => {
        this.setState({ afficherSingleModal: false })
    }

    // open sujet modal
    openSujetModal = () => {
        this.setState({ afficherNewSujetModal: true })
    }

    // close sujet modal
    closeSujetModal = () => {
        this.setState({ afficherNewSujetModal: false })
    }

    // changement Sujet
    changementSujet = e => {
        this.setState({ sujet: e })
    }

    // changement message
    changementMessage = e => {
        this.setState({ message: e })
    }

    // message reponse
    messageReponse = e => {
        this.setState({ messageRetour: e })
    }

    // sauvegarder Forum
    sauvegarderForum = () => {
        const forums = { ...this.state.forums } 
        const { sujet, message, usagerId, usagers } = this.state
        let id = Date.now()
        // date
        const d = new Date()
        let date = d.getHours()+":"+d.getMinutes()+" "+
        d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()  
        // recuperation du nom et du prenom
        let prenom = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].prenom)
        let nom = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].nom)
        // enregistrement du sujet avec le nom le message et la date
        if (sujet && message) {
            forums[id] = { 
                sujet: sujet,
                messages: [
                    { message: message, auteur: prenom+' '+nom, date: date }
                ],
                auteur: prenom+' '+nom,
                date: date
            }
            // mise a jour du state
            this.setState({ forums, afficherNewSujetModal: false, sujet: '', message: '', forumId: '' })
        } else {
            alert('tous les champs doivent êtres remplis')
        }
    }

    // repondre message
    repondreForum = () => {
        const forums = { ...this.state.forums }
        const { messageRetour, usagerId, forumId, usagers } = this.state
        // date
        const d = new Date()
        let date = d.getHours()+":"+d.getMinutes()+" "+
        d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()  
        // recuperation du nom et du prenom
        let prenom = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].prenom)
        let nom = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].nom)
        if (messageRetour) {
            forums[forumId].messages.push({
                auteur: prenom+' '+nom,
                date: date,
                message: messageRetour
            })
            // mise a jour du state
            this.setState({ forums, messageRetour: '' })
        } else {
            alert('le message est vide')
        }
    }

    // supprimer le chat
    bouttonSupprimerChat = (key) => {
        // alert confirmation
        Alert.alert(
            'Alert',
            'es-tu sur de vouloir supprimer le sujet ?',
            [
                {},
                {
                    text: 'non',
                    onPress: () => {},
                    style: 'cancel',
                },
                {text: 'oui', onPress: () => {
                    // supprimer le sujet database
                    const forums = { ...this.state.forums }
                    forums[key] = null
                    this.setState({ forums })
                }},
            ],
            {cancelable: false}
        );
    }

    supprimerMessage = (key,i) => {
        // alert confirmation
        Alert.alert(
            'Alert',
            'es-tu sur de vouloir supprimer le message',
            [
                {},
                {
                    text: 'non',
                    onPress: () => {},
                    style: 'cancel',
                },
                {text: 'oui', onPress: () => {
                    const forums = { ...this.state.forums }
                    let test = forums[key].messages[i].message
                    forums[key].messages[i] = null
                    this.setState({ forums })
                }},
            ],
            {cancelable: false}
        );
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref, this.ref2)
    }

    render () {

        const {
            // usager
            usagerId, 
            usagers, 
            // forums
            forums,
            sujet,
            forumId,
            messageRetour,
            // redirection
            redirectConnexion,
        } = this.state

        // en cours de chargement
        if (!forums && !usagers) {
            return <Text>En cours de chargement</Text>
        }

        // si pas identifier redirection page connexion 
        if (redirectConnexion) {
            this.props.navigation.navigate('Connexion')
        }

        // si adherent
        let adherent = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].adherent)
        if (String(adherent) === 'false') {
            return <Text>Tu dois être adherent pour consulter cette page</Text>
        }

        // si elu
        let elu = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].elu)
        if (String(elu) === 'false') {
            return <Text>Tu dois être elu pour consulter cette page</Text>
        }

        // si admin
        // si admin
        let admin = false
        let recupadmin = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].admin)
        if (String(recupadmin) === 'true') {
            admin = true
        }

        // list
        const list = Object.keys(forums).reverse().map(key => 
            <View key={key} style={styles.listView} >
                <TouchableOpacity 
                    // CLICK SUR UN ELEMENT DE LA LISTE
                    onPress={() => this.openSingleModal(key, forums[key].sujet)}
                    >
                    { /* SUJET MESSAGE */ }
                    <Text>{forums[key].sujet}</Text>
                    <View style={styles.auteurDateView}>
                        <View style={styles.auteurView}>
                            { /* AUTEUR MESSAGE */ }
                            <Text style={styles.auteur}>{forums[key].auteur}</Text>
                        </View>
                        <View style={styles.dateView}>
                            { /* DATE MESSAGE */ }
                            <Text style={styles.date}>{forums[key].date}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {admin?
                <TouchableOpacity onPress={() => this.bouttonSupprimerChat(key)}>
                <TitreRouge titre='supprimer le sujet'/>
                </TouchableOpacity>
                : null }
            </View>
            )


        return (
            <View style={styles.mainView}>
                <Text></Text>
                { /* BOUTTON AJOUTER UN SUJET */ }
                <Button 
                    color='red'
                    title='Ajouter un sujet'
                    onPress={this.openSujetModal}
                />
                <Text></Text>
                { /* LISTE SUJET FORUM */ }
                <ScrollView>
                    {list}
                </ScrollView>
                { /* MODAL FORUMLAIRE FORUM */ }
                <ForumSujetModal
                    afficher={false}
                    bouttonPresser={this.closeSujetModal}
                    changementSujet={this.changementSujet}
                    changementMessage={this.changementMessage}
                    sauvegarderForum={this.sauvegarderForum}
                />
                { /* MODAL SINGLE FORUM */ }
                <ForumSingleModal
                    afficherSingleModal={this.state.afficherSingleModal}
                    bouttonPresser={this.closeSingleModal}
                    repondreForum={this.repondreForum}
                    messageReponse={this.messageReponse}
                    messageRetour={messageRetour}
                    sujet={sujet}
                    forums={forums}
                    forumId={forumId}
                    supprimerMessage={this.supprimerMessage}
                />
                <ForumNewSujetModal
                    afficherNewSujetModal={this.state.afficherNewSujetModal}
                    bouttonPresser={this.closeSujetModal}
                    changementSujet={this.changementSujet}
                    changementMessage={this.changementMessage}
                    sauvegarderForum={this.sauvegarderForum}
                />
            </View>
        )
    }
}

export default Forum

const styles = StyleSheet.create({
    mainView: {
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 80,
    },
    listView: {
        borderBottomWidth: 2, 
        borderColor: 'yellow',
    },
    auteurDateView: {
        display: 'flex',
        flexDirection: 'row',
    },
    auteurView: {
        flex: 1,
    },
    dateView: {
        flex: 1,
    },
    auteur: {
        color: 'red',
    },
    date: {
        color: 'red',
        textAlign: 'right',
    },
})

