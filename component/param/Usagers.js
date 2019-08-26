import React, { Component } from 'react'
import { StyleSheet, View, Text, Button, TouchableOpacity, Image, WebView, FlatList, ScrollView, CheckBox } from 'react-native'
// firebase
import base from '../base/base'
import { auth } from '../base/base'
import 'firebase/database'
import firebase from 'firebase/app'
import { storage } from '../base/base'
// syndicat
import syndicat from '../syndicat/Syndicat'
import TitreRouge from '../elements/TitreRouge'
import ProfilModal from './ProfilModal'

class Usagers extends Component {
    state = {
        // base usagers
        usagers: '',
        usagerId: '',
        // usagers classé
        newState: '',
        // checked
        checkAdmin: true,
        checkElu: true,
        checkAdherent: true,
        // modal
        afficherProfilModal: false,
        modalId: '',
    }

    // au montage
    componentDidMount () {

        // connecter base usagers
        this.ref = base.syncState(syndicat+'/usagers',{
            context: this,
            state: 'usagers'
        })

        // classement afphabetique des usagers
        const recup = firebase.database().ref('web3/usagers').orderByChild('nom')
        recup.on('value', snapshot => {
            let newState = []
            snapshot.forEach(childSnapshot =>{
                var childData = childSnapshot.val()
                newState.push({
                    nom: childData.nom,
                    id: childData.id
                })        
            }) 
            this.setState({ newState })                     
        })
    }

    // turn adherent false
    turnAdherentFalse = (id) => {
        const usagers = { ...this.state.usagers }
        usagers[id].adherent = false
        this.setState({ usagers })
    }

    // turn adherent true
    turnAdherentTrue = (id) => {
        const usagers = { ...this.state.usagers }
        usagers[id].adherent = true
        this.setState({ usagers })
    }

    // turn elu false
    turnEluFalse = (id) => {
        const usagers = { ...this.state.usagers }
        usagers[id].elu = false
        this.setState({ usagers })
    }

    // turn elu true
    turnEluTrue = (id) => {
        const usagers = { ...this.state.usagers }
        usagers[id].elu = true
        this.setState({ usagers })
    }

    // turn admin false
    turnAdminFalse = (id) => {
        const usagers = { ...this.state.usagers }
        usagers[id].admin = false
        this.setState({ usagers })
    }

    // turn admin true
    turnAdminTrue = (id) => {
        const usagers = { ...this.state.usagers }
        usagers[id].admin = true
        this.setState({ usagers })
    }

    // afficher modal profil
    openProfilModal = (modalId) => {
        this.setState({ afficherProfilModal: true, modalId: modalId })
    }

    // fermer modal profil
    closeProfilModal = () => {
        this.setState({ afficherProfilModal: false, modalId: '' })
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref)
    }


    render () {
        const {
            usagers,
            newState,
            //
            modalId,
        } = this.state


        // liste usager
        const list = Object.keys(newState).map(key =>
            <View style={styles.listView} key={key}>
                { /* NOM ET PRENOM */ }
                <Text style={styles.text}>{newState[key].nom} {usagers[newState[key].id].prenom}</Text>
                <View style={styles.checkView}>
                    <View>
                        <Text style={styles.textBox}>Adh</Text>
                    </View>
                    <View>
                        { /* CHECKBOX ADMIN */ }
                        {usagers[newState[key].id].adherent?
                        <CheckBox
                            value={this.state.checkAdherent}
                            onValueChange={() => this.turnAdherentFalse(newState[key].id)}
                        />
                        :
                        <CheckBox
                            value={!this.state.checkAdherent}
                            onValueChange={() => this.turnAdherentTrue(newState[key].id)}
                        />
                        }
                    </View>
                    <View>
                        <Text style={styles.textBox}>Elu</Text>
                    </View>
                    <View>
                        { /* CHECKBOX ADMIN */ }
                        {usagers[newState[key].id].elu?
                        <CheckBox
                            value={this.state.checkElu}
                            onValueChange={() => this.turnEluFalse(newState[key].id)}
                        />
                        :
                        <CheckBox
                            value={!this.state.checkElu}
                            onValueChange={() => this.turnEluTrue(newState[key].id)}
                        />
                        }
                    </View>
                    <View>
                        <Text style={styles.textBox}>Adm</Text>
                    </View>
                    <View>
                        { /* CHECKBOX ADMIN */ }
                        {usagers[newState[key].id].admin?
                        <CheckBox
                            value={this.state.checkAdmin}
                            onValueChange={() => this.turnAdminFalse(newState[key].id)}
                        />
                        :
                        <CheckBox
                            value={!this.state.checkAdmin}
                            onValueChange={() => this.turnAdminTrue(newState[key].id)}
                        />
                        }
                    </View>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            onPress={() => {this.openProfilModal(newState[key].id)}}
                        >
                        <Text style={styles.textProfil}>Afficher profil</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            )

        return (
            <View style={styles.mainView}>
                <Text></Text>
                <TitreRouge titre='liste des usagers'/>
                <Text></Text>
                <ScrollView>
                    {list}
                    <ProfilModal
                        afficherProfilModal={this.state.afficherProfilModal}
                        bouttonPresser={this.closeProfilModal}
                        modalId={modalId}
                    />
                </ScrollView>
            </View>
        )
    }
}

export default Usagers

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
    checkView: {
        display: 'flex',
        flexDirection: 'row',
    },
    boxView: {
        flex: 1,
    },
    textBox: {
        marginTop: 7,
    },
    textProfil: {
        marginTop: 7,
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'right',
    },
})
