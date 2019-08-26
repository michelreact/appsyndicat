import React, { Component } from 'react'
import { StyleSheet, View, Text, Modal, Button, TextInput, TouchableOpacity } from 'react-native'
// firebase
import 'firebase/auth'
import TitreRouge from '../elements/TitreRouge'

class TractModal extends Component {

    // fermer modal
    bouttonPresser = () => {
        this.props.bouttonPresser()
    }

    // changement titre
    changementTitre = e => {
        this.props.changementTitre(e)
    }

    // ajouter un fichier
    bouttonAjouterFichier = () => {
        this.props.bouttonAjouterFichier()
    }

    // supprimer fichier
    bouttonSupprimerFichier = () => {
        this.props.bouttonSupprimerFichier()
    }

    // sauvegarder tract
    bouttonSauvegarder = () => {
        this.props.bouttonSauvegarder()
    }
    
    render() {
        return(
            <View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible = { this.props.afficherModal }
                    onRequestClose={() => {
                    }}> 
                    <View>
                        <TouchableOpacity
                            style={styles.toucheFermerModal}
                            onPress={this.bouttonPresser}
                        >
                            <Text style={styles.textToucheFermerModal}>FERMER</Text>
                        </TouchableOpacity>
                        <View style={styles.viewMain}>
                            <TitreRouge titre= 'Titre'/>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text) => this.changementTitre(text)}
                                value={this.props.tractTitreProvisoire}
                                maxlenght={500}
                            />
                            <Text></Text>
                            {this.props.tractTitreFichierProvisoire?
                            <TouchableOpacity
                                onPress={this.bouttonSupprimerFichier}
                            >
                            <TitreRouge titre='Supprimer le fichier'/>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={this.bouttonAjouterFichier}
                            >
                            <TitreRouge titre='Ajouter un fichier'/>
                            </TouchableOpacity>
                            }
                            {this.props.tractTitreFichierProvisoire?
                            <TitreRouge titre={this.props.tractTitreFichierProvisoire}/>
                            :
                            null}
                            <Text></Text>
                            <Button
                                title='Sauvegarder'
                                onPress={this.bouttonSauvegarder}
                            />
                        </View>
                    </View>
                </Modal>           
            </View>
        )
    }
}

export default TractModal

const styles = StyleSheet.create({
    viewMain:{
        marginLeft: 20,
        marginRight: 20,
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
    }
})


