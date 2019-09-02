import React, { Component } from 'react'
import { StyleSheet, View, Text, Modal, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native'
// firebase
import base from '../base/base'
import { auth } from '../base/base'
import 'firebase/database'
import firebase from 'firebase/app'
import { storage } from '../base/base'
// syndicat
import syndicat from '../syndicat/Syndicat'
import TitreRouge from '../elements/TitreRouge'

class ForumSingleModal extends Component {

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

    // fermer modal
    bouttonPresser = () => {
        this.props.bouttonPresser()
    }

    // message reponse
    messageReponse = e => {
        this.props.messageReponse(e)
    }

    // boutton repondre
    repondreForum = () => {
        this.props.repondreForum()
    }

    // boutton supprimer message
    bouttonSupprimerMessage = (e,i) => {
        this.props.supprimerMessage(e,i)
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref, this.ref2)
    }


    render () {

        const {
            forums,
            forumId,
        } = this.props


        // liste des messages
        const list = Object
            .keys(forums)
            .filter(key => key === forumId)
            .map(key =>
                <View key={key}>
                {forums[key].messages
                    .map((ite, index) =>
                        <View key={ite.message} style={styles.listView}>
                            <Text>{ite.message}</Text>
                            <View style={styles.auteurDateView}>
                                <View style={styles.auteurView}>
                                    <Text style={styles.auteur}>{ite.auteur}</Text>
                                </View>
                                <View style={styles.dateView}>
                                    <Text style={styles.date}>{ite.date}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => this.bouttonSupprimerMessage(key,index)}>
                                <TitreRouge titre='supprimer le message'/>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>)

        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible = { this.props.afficherSingleModal }
                    onRequestClose={() => {
                    }}> 
                    <ScrollView>
                    <View>
                        { /* FERMER MODAL */ }
                        <TouchableOpacity
                            style={styles.toucheFermerModal}
                            onPress={this.bouttonPresser}
                        >
                            <Text style={styles.textToucheFermerModal}>FERMER</Text>
                        </TouchableOpacity>
                        <View style={styles.viewMain}>
                            <Text></Text>
                            { /* INPUT MESSAGE */ }
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text) => this.messageReponse(text)}
                                value={this.props.messageRetour}
                                multiline = {true}
                                numberOfLines = {3}
                                maxlenght={5000}
                            />
                            <Text></Text>
                            { /* BOUTTON REPONDRE */}
                            <Button
                                color= 'red'
                                title= 'repondre'
                                onPress={this.repondreForum}
                            />
                            <Text></Text>
                            <Text style={styles.text}>{this.props.sujet}</Text>
                                {list}
                        </View>
                    </View>
                    </ScrollView>
                </Modal> 
            </View>
        )
    }
}

export default ForumSingleModal

const styles = StyleSheet.create({
    viewMain:{
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 80,
    },
    toucheFermerModal:{
        backgroundColor: 'red',
        alignSelf: 'flex-end',
        marginRight: 20,
        marginTop: 10,
    },
    textToucheFermerModal:{
        color:'white',
        textAlign: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
    },
    textInput:{
        borderColor: 'red',
        borderWidth: 1,
        paddingLeft: 5,
        paddingRight: 5,
        textAlignVertical: 'top'
    },
    text: {
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold',
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
