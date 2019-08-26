import React, { Component } from 'react'
import { StyleSheet, View, Text, Button, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native'
// firebase
import base from '../base/base'
import { auth } from '../base/base'
import 'firebase/database'
import firebase from 'firebase/app'
import { storage } from '../base/base'
// syndicat
import syndicat from '../syndicat/Syndicat'
import TitreRouge from '../elements/TitreRouge'

class ProfilModal extends Component {
    state = {
        // usagers 
        usagers: '',
        // modifier profil
        afficherModifierProfil: false,
        // value input
        profilNom: '',
        profilPrenom: '',
        profilTelephone: '',
        profilAdresse: '',
    }

    // au montage
    componentDidMount () {

        // connecter base usagers
        this.ref = base.syncState(syndicat+'/usagers',{
            context: this,
            state: 'usagers'
        })
    }

    // fermer modal
    bouttonPresser = () => {
        this.props.bouttonPresser()
    }

    // modifier le profil
    modifierProfil = () => {
        this.setState({ afficherModifierProfil: true })
    }

    // abandonner modifier profil
    abandonnerModifierProfil = () => {
        this.setState({ afficherModifierProfil: false })
    }

    // sauvegarder le profil modifier
    sauvegarderModifierProfil = () => {
        const usagers = { ...this.state.usagers }
        const { profilNom, profilPrenom, profilTelephone, profilAdresse } = this.state
        usagers[this.props.modalId] = { nom: profilNom.toUpperCase(), prenom: profilPrenom, telephone: profilTelephone, adresse: profilAdresse }
        this.setState({ usagers, afficherModifierProfil: false, profilNom: '', profilPrenom: '', profilTelephone: '', profilAdresse: '' })
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref)
    }

    render () {
        const { usagers, afficherModifierProfil, profilNom, profilPrenom, profilTelephone, profilAdresse } = this.state

        // list
        const list = Object.keys(usagers).filter(key => key === this.props.modalId).map(key =>
                <View key={key}>
                    <Text>Nom : {usagers[key].nom}</Text>
                    <Text>Prenom : {usagers[key].prenom}</Text>
                    <Text></Text>
                    <Text>Telephone : {usagers[key].telephone}</Text>
                    <Text>Email : {usagers[key].mail}</Text>
                    <Text>Adresse : {usagers[key].adresse}</Text>
                    {usagers[key].adherent?
                    <Text>Adherent : oui</Text>
                    :
                    <Text>Adherent : non</Text>
                    }
                    {usagers[key].elu?
                    <Text>Elu : oui</Text>
                    :
                    <Text>Elu : non</Text>
                    }
                    {usagers[key].admin?
                    <Text>Administrateur : oui</Text>
                    :
                    <Text>Administrateur : non</Text>
                    }
                </View>
            )
            
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible = { this.props.afficherProfilModal }
                    onRequestClose={() => {
                    }}>
                    <ScrollView>
                    { /* FERMER MODAL */ }
                        <TouchableOpacity
                            style={styles.toucheFermerModal}
                            onPress={this.bouttonPresser}
                        >
                            <Text style={styles.textToucheFermerModal}>FERMER</Text>
                        </TouchableOpacity>
                    <View style={styles.viewMain}>
                        {/* AFFICHER LES ELEMENT DU PROFIL */}
                        {list}
                        {/* BOUTTON MODIFIER PROFIL */}
                        {afficherModifierProfil?null
                        :
                        <TouchableOpacity
                            onPress={this.modifierProfil}
                        >
                        <TitreRouge titre='modifier le profil'/>
                        </TouchableOpacity>
                        }
                        {afficherModifierProfil?
                        <View>
                            {/* BOUTTON ABANDONNER MODIFIER PROFIL */}
                            <TouchableOpacity
                                onPress={this.abandonnerModifierProfil}
                            >
                                <TitreRouge titre='abandonner'/>
                            </TouchableOpacity>
                            {/* BOUTTON SAUVEGARDER PROFIL */}
                            <Text>Nom :</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(nom) => this.setState({profilNom:nom})}
                                value={profilNom}
                                maxlenght={50}
                            />
                            <Text>Prenom :</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(prenom) => this.setState({profilPrenom:prenom})}
                                value={profilPrenom}
                                maxlenght={50}
                            />
                            <Text>Telephone :</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(telephone) => this.setState({profilTelephone:telephone})}
                                value={profilTelephone}
                                maxlenght={50}
                            />
                            <Text>Adresse :</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(adresse) => this.setState({profilAdresse:adresse})}
                                value={profilAdresse}
                                multiline = {true}
                                numberOfLines = {4}
                                maxlenght={500}
                            />
                            <Text></Text>
                            <TouchableOpacity
                                onPress={this.sauvegarderModifierProfil}
                            >
                                <TitreRouge titre='sauvegarder'/>
                            </TouchableOpacity>
                        </View>
                        :null}
                    </View>
                    <View style={{ height: 600 }}/>
                    </ScrollView>
                </Modal>
            </View>
        )
    }
}

export default ProfilModal

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
})
