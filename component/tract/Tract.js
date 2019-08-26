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
import TractModal from './TractModal'
import TitreRouge from '../elements/TitreRouge'
// document picker
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import TractModifSuppModal from './TractModifSuppModal'
import TractModalPdf from './TractModalPdf';

class Tract extends Component {
    state = {
        // base usagers
        usagers: '',
        usagerId: '',
        // base tracts
        tracts: '',
        tractTitre: '',
        tractFichier: '',
        tractId: '',
        // tract provisoire (modal)
        tractTitreProvisoire: '',
        tractTitreFichierProvisoire: '',
        // redirection
        redirectConnexion: false,
        redirectionHome: false,
        redirectionTractForm: false,
        // modal
        afficherModal: false,
        afficherModifSuppModal: false,
        afficherModalPdf: false,
        tractModalUrl: '',
        // image
        img: '',
        url: '',
    }

    // au montage
    componentDidMount () {

        // connecter base usagers
        this.ref = base.syncState(syndicat+'/usagers',{
            context: this,
            state: 'usagers'
        })

        // connecter base tracts
        this.ref2 = base.syncState(syndicat+'/tracts',{
            context: this,
            state: 'tracts'
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


    // boutton telecharger
    telechargerTract = fichier => {
        storage.ref(syndicat).child(fichier).getDownloadURL().then(url => {
            alert(url)
            this.setState({ img: url})
        })
    }

    // afficher modal
    bouttonAfficherModal = () => {
        this.setState({ afficherModal:true })
    }

    // fermer modal
    bouttonFermerModal = () => {
        this.setState({ afficherModal:false })
    }

    openModalAdmin = (titre, fichier, id) => {
        this.setState({ afficherModifSuppModal: true, tractTitreProvisoire: titre, tractTitreFichierProvisoire: fichier, tractId: id })
    }

    // fermer modal admin
    closeTractModifSuppModal = () => {
        this.setState({ afficherModifSuppModal: false, tractTitreProvisoire: '', tractTitreFichierProvisoire: '', tractId: '' })
    }

    // ouvrir modal pdf
    openModalPdf = (fichier) => {
        // this.setState({ afficherModalPdf: true })
        storage.ref(syndicat).child(fichier).getDownloadURL().then(url => {
            this.setState({ tractModalUrl: url, afficherModalPdf: true })
        })
    }

    // fermer modal pdf
    fermerModalPdf = () => {
        this.setState({ afficherModalPdf: false, tractModalUrl:'' })
    }

    // modifier tract
    modifierTract = () => {
        this.setState({ afficherModifSuppModal: false, afficherModal: true })
    }

    // supprimer tracts
    supprimerTract = () => {
        const tracts = { ...this.state.tracts }
        const { tractTitreFichierProvisoire, tractId } = this.state
        tracts[tractId] = null
        storage.ref(`${syndicat}/${tractTitreFichierProvisoire}`).delete()
        this.setState({ tracts, afficherModifSuppModal: false, tractTitreProvisoire: '', tractTitreFichierProvisoire: '', tractId: '' })
    }

    // changement titre
    changementTitre = e => {
        this.setState({ tractTitreProvisoire: e })
    }

    // ajouter un fichier
    bouttonAjouterFichier = () => {
        DocumentPicker.show(
            {
                filetype: [DocumentPickerUtil.allFiles()]
            },
            (error, res) => {
                let nom = res.fileName + Date.now()
                this.getFileBlog(res.uri, blob => {
                    storage.ref(`${syndicat}/${nom}`).put(blob)
                })
                this.setState({ tractTitreFichierProvisoire: nom })
            }
        )
    }

    // boutton supprimer fichier
    bouttonSupprimerFichier = () => {
        storage.ref(`${syndicat}/${this.state.tractTitreFichierProvisoire}`).delete()
        this.setState({ tractTitreFichierProvisoire: '', tractFichierProvisoire: '' })
    }

    // modifier tracts
    openTractModifSuppModal = (titre, fichier, id) => {

    }

    // boutton sauvegarder
    bouttonSauvegarder = () => {
        const tracts = {...this.state.tracts}
        const { tractTitreProvisoire, tractTitreFichierProvisoire, tractId } = this.state
        let id = null
        if (tractTitreProvisoire && tractTitreFichierProvisoire) {
            if (tractId) {
                id = tractId
            } else {
                id = Date.now()
            }
            tracts[id] = { titre: tractTitreProvisoire, fichier: tractTitreFichierProvisoire }
            this.setState({tracts, afficherModal:false, tractId: '', tractTitreProvisoire: '', tractTitreFichierProvisoire: '' })
        } else {
            alert('le titre et le fichier doivent être renseignés')
        }
    }

    // blob method
    getFileBlog = (url, cb) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function() {
          cb(xhr.response);
        });
        xhr.send();
    }

    // deconnecter base usagers
    componentWillUnmount () {
        base.removeBinding(this.ref, this.ref2)
    }

    render() {
        const { 
            // tract
            tracts,
            tractTitre,
            tractFichier,
            tractId,
            // usager
            usagerId, 
            usagers, 
            // modal
            tractTitreProvisoire,
            tractTitreFichierProvisoire,
            // redirection
            redirectConnexion,
        } = this.state

        // en cours de chargement
        if (!tracts && !usagers) {
            return <Text style={styles.text}>En cours de chargement</Text>
        }
        // redirect page connexion
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
        const list = Object.keys(tracts).reverse().map(key =>
            <View key={key} style={styles.tractViewList}>
                <View style={styles.tractViewText}>
                    <Text>{tracts[key].titre}</Text>
                    <TouchableOpacity
                        onPress={() => this.openModalPdf(tracts[key].fichier)}
                    >
                    <TitreRouge titre='telecharger pdf'/>
                    </TouchableOpacity>
                </View>
                { /* BOUTTON MODIFIER SUPPRIMER TRACT */ }
                {admin?
                <View style={styles.tractViewButtonAdmin}>
                    <TouchableOpacity
                        onPress={() => this.openModalAdmin(
                            tracts[key].titre,
                            tracts[key].fichier,
                            key
                        )}
                    >
                        <Text style={styles.tractViewTextButtonAdmin}>+</Text>
                    </TouchableOpacity>
                </View>
                :null}
            </View>
            )
        return(
            <View style={styles.mainView}> 
                <Text></Text>
                {admin?
                <Button 
                    color='red'
                    title='Ajouter un tract'
                    onPress={this.bouttonAfficherModal}
                />
                :null}
                <Text></Text>
                <ScrollView>
                    {list}
                    <Image
                        style={styles.tailleImage}
                        source={{uri:this.state.url}}
                    />
                </ScrollView>
                { /* modal ajouter un tract */ }
                <TractModal
                    afficherModal={this.state.afficherModal}
                    bouttonPresser={this.bouttonFermerModal}
                    changementTitre={this.changementTitre}
                    bouttonAjouterFichier={this.bouttonAjouterFichier}
                    bouttonSupprimerFichier={this.bouttonSupprimerFichier}
                    bouttonSauvegarder={this.bouttonSauvegarder}
                    tractTitreProvisoire={tractTitreProvisoire}
                    tractTitreFichierProvisoire={tractTitreFichierProvisoire}
                    tractTitre={tractTitre}
                    tractFichier={tractFichier}
                    tractId={tractId}
                />
                { /* MODAL AJOUT SUPPRIMER INFO */ }
                <TractModifSuppModal
                    afficherModifSuppModal={this.state.afficherModifSuppModal}
                    bouttonPresser={this.closeTractModifSuppModal}
                    modifierPresser={this.modifierTract}
                    supprimerPresser={this.supprimerTract}
                />
                <TractModalPdf
                    fermerModalPdf={this.fermerModalPdf}
                    afficherModalPdf={this.state.afficherModalPdf}
                    tractModalUrl={this.state.tractModalUrl}
                />
            </View>
        )
    }
}


export default Tract

const styles = StyleSheet.create({
    mainView: {
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 80,
    },
    tractViewList: {
        height: 40,
        borderBottomWidth: 2, 
        borderColor: 'yellow',
        display: 'flex',
        flexDirection: 'row',
    },
    tractViewText: {
        flex: 7,
    },
    tractViewButtonAdmin: {
        flex: 1,
    },
    tractViewTextButtonAdmin: {
        marginTop: 5,
        marginBottom: 5,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: 'red',
        textAlign: 'center',
    }
})


