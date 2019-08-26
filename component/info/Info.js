import React, { Component } from 'react'
import { StyleSheet, View, Text, Button, TouchableOpacity, Image, WebView, ScrollView } from 'react-native'
// firebase
import base from '../base/base'
import { auth } from '../base/base'
import 'firebase/database'
import firebase from 'firebase/app'
import { storage } from '../base/base'
// syndicat
import syndicat from '../syndicat/Syndicat'
import InfoSingleModal from './InfoSingleModal'
import InfoModifSuppModal from './InfoModifSuppModal'
import InfoFormModal from './InfoFormModal'

class Info extends Component {
    state = {
        // base usagers
        usagers: '',
        usagerId: '',
        // base tracts
        infos: '',
        infoTitre: '',
        infoTextarea: '',
        infoId: '',
        // redirection
        redirectConnexion: false,
        redirectionHome: false,
        redirectionTractForm: false,
        // modal
        afficherSingleModal: false,
        afficherModifSuppModal: false,
        afficherFormModal: false,
    }

    // au montage
    componentDidMount () {

        // connecter base usagers
        this.ref = base.syncState(syndicat+'/usagers',{
            context: this,
            state: 'usagers'
        })

        // connecter base tracts
        this.ref2 = base.syncState(syndicat+'/infos',{
            context: this,
            state: 'infos'
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

    // ouvrir modal formulaire info
    openFormModal = () => {
        this.setState({ afficherFormModal:true })
    }

    // fermer modal formulaire info
    closeFormModal = () => {
        this.setState({ afficherFormModal:false, infoTitre:'', infoTextarea:'', infoId:'' })
    }

    // ouvrir modal modifier supprimer info
    openInfoModifSuppModal = (titre, text, id) => {
        this.setState({ infoTitre:titre, infoTextarea:text, infoId:id, afficherModifSuppModal:true })
    }

    // fermer modal modifier supprimer info
    closeInfoModifSuppModal = () => {
        this.setState({ afficherModifSuppModal:false, infoTitre:'', infoTextarea:'', infoId:'' })
    }

    // ouvrir modal single info
    openInfoSingleModal = (infoTitre, infoTextarea) => {
        this.setState({ infoTitre:infoTitre, infoTextarea:infoTextarea, afficherSingleModal:true })
    }

    // fermer modal info single
    closeInfoModalSingle = () => {
        this.setState({ afficherSingleModal:false, infoTitre:'', infoTextarea:'', infoId:'' })
    }

    // changement titre
    changementTitre = e => {
        this.setState({ infoTitre:e })
    }

    // changement text area
    changementTextarea = e => {
        this.setState({ infoTextarea:e })
    }

    // sauvegarder info
    sauvegarderInfo = () => {
        const infos = {...this.state.infos}
        const { infoTitre, infoTextarea, infoId } = this.state
        let id = null
        if (infoTitre && infoTextarea) {
            if (infoId) {
                id = infoId
            } else {
                id = Date.now()
            }
            infos[id] = { infoTitre:infoTitre, infoTextarea:infoTextarea, infoId: id }
            this.setState({infos, afficherFormModal:false, infoTitre:'', infoTextarea:'', infoId:'' })
        }else {
            alert('Tous les champs ne sont pas remplis !')
        }
    }

    // modifier info
    modifierInfo = () => {
        this.setState({ afficherModifSuppModal:false, afficherFormModal:true })
    }

    // supprimer info
    supprimerInfo = () => {
        const infos = {...this.state.infos}
        infos[this.state.infoId] = null
        this.setState({ infos, afficherModifSuppModal:false, infoTitre:'', infoTextarea:'', infoId:'' })
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref, this.ref2)
    }

    render () {
        const {
            // infos
            infos,
            infoTitre,
            infoTextarea,
            infoId,
            // usager
            usagerId, 
            usagers, 
            // redirection
            redirectConnexion,
        } = this.state
    

        // en cours de chargement
        if (!infos && !usagers) {
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

        // si admin
        let admin = false
        let recupadmin = Object.keys(usagers).filter(key => key === usagerId).map(key => usagers[key].admin)
        if (String(recupadmin) === 'true') {
            admin = true
        }

        // list tract
        const list = Object.keys(infos).reverse().map(key =>
            <View key={key} style={styles.infoViewList}>
                <View style={styles.infoViewText}>
                { /* CLICK SUR UN ELEMENT DE LA LISTE INFO */ }
                    <TouchableOpacity
                        onPress={() => {this.openInfoSingleModal(infos[key].infoTitre, infos[key].infoTextarea )}}
                    >
                        <Text style={styles.infoTextList}>{infos[key].infoTitre}</Text>
                    </TouchableOpacity>
                </View>
                { /* BOUTTON MODIFIER SUPPRIMER INFO */ }
                {admin?
                <View style={styles.infoViewButtonAdmin}>
                    <TouchableOpacity
                        onPress={() => {this.openInfoModifSuppModal(infos[key].infoTitre, infos[key].infoTextarea, infos[key].infoId)}}
                    >
                        <Text style={styles.infoViewTextButtonAdmin}>+</Text>
                    </TouchableOpacity>
                </View>
                :null}
            </View>
        )

        return (
            <View style={styles.mainView}>
                <Text></Text>
                { /* BOUTTON AJOUTER INFO */ }
                {admin?
                <Button 
                    color='red'
                    title='Ajouter infos'
                    onPress={this.openFormModal}
                />
                :null}
                <Text></Text>
                { /* LISTE INFOS */ }
                <ScrollView>
                    {list}
                </ScrollView>
                { /* MODAL FORUMLAIRE INFO */ }
                <InfoFormModal
                    afficherFormModal={this.state.afficherFormModal}
                    bouttonPresser={this.closeFormModal}
                    sauvegarderInfo={this.sauvegarderInfo}
                    changementTitre={this.changementTitre}
                    changementTextarea={this.changementTextarea}
                    titre={infoTitre}
                    text={infoTextarea}
                    id={infoId}
                />
                { /* MODAL SINGLE INFO */ }
                <InfoSingleModal
                    afficherSingleModal={this.state.afficherSingleModal}
                    bouttonPresser={this.closeInfoModalSingle}
                    infoTitre={infoTitre}
                    infoTextarea={infoTextarea}
                />
                { /* MODAL AJOUT SUPPRIMER INFO */ }
                <InfoModifSuppModal
                    afficherModifSuppModal={this.state.afficherModifSuppModal}
                    bouttonPresser={this.closeInfoModifSuppModal}
                    modifierPresser={this.modifierInfo}
                    supprimerPresser={this.supprimerInfo}
                />
            </View>
        )
    }
}

export default Info

const styles = StyleSheet.create({
    mainView: {
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 80,
    },
    infoViewList: {
        borderBottomWidth: 2, 
        borderColor: 'yellow',
        display: 'flex',
        flexDirection: 'row',
    },
    infoViewText: {
        flex: 7,
    },
    infoTextList: {
        marginTop: 5,
        marginBottom: 5,
    },
    infoViewButtonAdmin: {
        flex: 1,
    },
    infoViewTextButtonAdmin: {
        marginTop: 5,
        marginBottom: 5,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: 'red',
        textAlign: 'center',
    }
})


