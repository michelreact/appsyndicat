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
// modal
import EquipeFormModal from './EquipeFormModal'
// image picker
import ImagePicker from 'react-native-image-picker'

class Equipe extends Component {
    state = {
        // base usagers
        usagers: '',
        usagerId: '',
        // equipe
        equipes: '',
        equipeNom: '',
        equipeFonction: '',
        equipeId: '',
        equipePhoto: '',
        equipeUrl: '',
        url: '',
        equipePhotoProvisoire: '',
        equipeUrlPhotoProvisoire: '',
        equipeNomPhoto: '',
        equipeUrlPhoto: '',
        // modal
        afficherFormModal: false,
        // image profil neutre
        imageProfil: '',
    }

    // au montage
    componentDidMount () {

        // connecter base usagers
        this.ref = base.syncState(syndicat+'/usagers',{
            context: this,
            state: 'usagers'
        })

        // connecter base tracts
        this.ref2 = base.syncState(syndicat+'/equipes',{
            context: this,
            state: 'equipes'
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
        this.setState({ afficherFormModal:false, equipeNom:'', equipeFonction:'', equipePhotoProvisoire: '', equipeUrlPhotoProvisoire: '' })
    }

    // changement nom
    changementNom = e => {
        this.setState({ equipeNom:e })
    }

    // changement fonction
    changementFonction = e => {
        this.setState({ equipeFonction:e })
    }

    // selection photo
    selectionPhoto = () => {
        ImagePicker.launchImageLibrary({}, (response) => {
            if (response.error) {
                alert('erreur lors du chargement de la photo')
            } else {
                let nom = response.fileName + Date.now()
                this.getFileBlog(response.uri, blob => {
                    storage.ref(`${syndicat}/${nom}`).put(blob)
                })
                this.setState({ equipeUrlPhotoProvisoire: response.uri, equipePhotoProvisoire: nom })
            }
        })
        // this.setState({ equipePhoto: e })  
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

    // supprimer photo 2
    supprimerPhoto2 = () => {
        storage.ref(`${syndicat}/${this.state.equipeNomPhoto}`).delete()
        this.setState({ equipeNomPhoto: '', equipeUrlPhoto: '' })
    }

    // supprimer photo
    supprimerPhoto = () => {
        storage.ref(`${syndicat}/${this.state.equipePhotoProvisoire}`).delete()
        this.setState({ equipePhotoProvisoire: '', equipeUrlPhotoProvisoire: '' })
    }

    // sauvegarder equipe
    sauvegarderEquipe = () => {
        const equipes = {...this.state.equipes}
        const { equipeNom, equipeFonction, equipeId, equipePhotoProvisoire, equipeUrlPhotoProvisoire } = this.state
        let id = null
        if (equipeNom && equipeFonction) {
            if (equipeId) {
                id = equipeId
            } else {
                id = Date.now()
            }
            // si il y a une photo
            if (equipePhotoProvisoire) {
                storage.ref(`${syndicat}/${equipePhotoProvisoire}`).getDownloadURL().then(url => {
                    equipes[id] = { nom: equipeNom, fonction: equipeFonction, photo: equipePhotoProvisoire, url: url }
                    this.setState({equipes, afficherFormModal:false, equipeNom: '', equipeFonction: '', equipeId: '', equipePhotoProvisoire: '', equipeUrlPhotoProvisoire: '' })
                })
            // il n y a pas de photo
            }else {
                equipes[id] = { nom: equipeNom, fonction: equipeFonction, photo: equipePhotoProvisoire, url: '' }
                this.setState({equipes, afficherFormModal:false, equipeNom: '', equipeFonction: '', equipeId: '' })
            }
        }
    }

    // modifier equipier
    modifierEquipier = (nom, fonction, id, photo, url) => {
        this.setState({ equipeNom: nom, 
                        equipeFonction: fonction, 
                        equipeId: id, 
                        equipePhotoProvisoire: photo,
                        equipeUrlPhotoProvisoire: url,
                        afficherFormModal:true })
    }

    // supprimer equipier
    supprimerEquipier = (id, imageName) => {
        // alert confirmation
        Alert.alert(
            'Alert',
            'es-tu sur de vouloir supprimer',
            [
                {},
                {
                    text: 'non',
                    onPress: () => {},
                    style: 'cancel',
                },
                {text: 'oui', onPress: () => {
                    // supprimer equipier database
                    const equipes = { ...this.state.equipes }
                    equipes[id] = null
                    this.setState({ equipes })
                    // supprimer la photo du storage si il y en a une
                    if (imageName) {
                        storage.ref(`${syndicat}/${imageName}`).delete()
                    }
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
            // equipes
            equipes,
            equipeNom,
            equipeFonction,
            equipePhoto,
            equipeUrl,
            equipeNomPhoto,
            equipeUrlPhoto,
            equipeUrlPhotoProvisoire,
            // usager
            usagerId, 
            usagers, 
            // redirection
            redirectConnexion,
        } = this.state
    

        // en cours de chargement
        if (!equipes && !usagers) {
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

        // list equipe
        const list = Object.keys(equipes).reverse().map(key =>
                <View key={key} style={styles.equipierView}>
                    { /* IMAGE EQUIPIER */ }
                    <View style={styles.imageView}>
                        {equipes[key].url?
                        <Image
                            style={styles.tailleImage}
                            source={{uri:equipes[key].url}}
                        />
                        :
                        <Image
                            style={styles.tailleImage}
                            source={require('../assets/profil.jpg')}
                        />
                        }
                    </View>
                    { /* NOM ET FONCTION EQUIPIER */ }
                    <View style={styles.textView}>
                        <Text>{equipes[key].nom}</Text>
                        <Text>{equipes[key].fonction}</Text>
                        { /* BOUTTON MODIFIER ET SUPPRIMER EQUIPIER */ }
                    {admin?
                    <View>
                        <Button
                            color='gold'
                            title='modifier'
                            onPress={() => this.modifierEquipier(equipes[key].nom, equipes[key].fonction, key, equipes[key].photo, equipes[key].url)}
                        />
                        <Button
                            color='red'
                            title='supprimer'
                            onPress={() => this.supprimerEquipier(key, equipes[key].photo)}
                        />
                    </View>
                    :null}
                    </View>
                </View>
            )

        return (
            <View style={styles.mainView}>
            <Text></Text>
                { /* BOUTTON AJOUTER UN EQUIPIER */ }
                {admin?
                <Button 
                    color='red'
                    title='Ajouter un equipier'
                    onPress={this.openFormModal}
                />
                :null}
                <Text></Text>
                { /* LISTE EQUIPIER */ }
                <ScrollView>
                    {list}
                </ScrollView>
                { /* MODAL FORMULAIRE EQUIPE */ }
                <EquipeFormModal
                    afficherFormModal={this.state.afficherFormModal}
                    closeFormModal={this.closeFormModal}
                    sauvegarderEquipe={this.sauvegarderEquipe}
                    changementNom={this.changementNom}
                    changementFonction={this.changementFonction}
                    selectionPhoto={this.selectionPhoto}
                    supprimerPhoto={this.supprimerPhoto}
                    equipeNom={equipeNom}
                    equipeFonction={equipeFonction}
                    equipePhoto={equipePhoto}
                    equipeUrl={equipeUrl}
                    equipeNomPhoto={equipeNomPhoto}
                    equipeUrlPhoto={equipeUrlPhoto}
                    equipeUrlPhotoProvisoire={equipeUrlPhotoProvisoire}
                />
            </View>
        )
    }
}

export default Equipe

const styles = StyleSheet.create({
    mainView: {
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 80,
    },
    equipierView: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 10,
    },
    imageView: {
       flex: 1,
    },
    textView: {
        flex: 1,
    },
    tailleImage: {
        width: 130,
        height: 130,
    },
})


