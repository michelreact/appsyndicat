import React, { Component } from 'react'
import { 
    StyleSheet, 
    View, 
    Text, 
    Modal, 
    Button, 
    TextInput, 
    Image, 
    TouchableOpacity, 
    ScrollView 
} from 'react-native'
// elements
import TitreRouge from '../elements/TitreRouge'


class EquipeFormModal extends Component {
    // fermer modal
    closeFormModal = () => {
        this.props.closeFormModal()
    }

    // changement nom
    changementNom = e => {
        this.props.changementNom(e)
    }

    // changement fonction
    changementFonction = e => {
        this.props.changementFonction(e)
    }

    // boutton choisir une photo
    selectionPhoto = () => {
        this.props.selectionPhoto()
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

    // supprimer la photo 2
    supprimerPhoto2 = () => {
        alert('nom photo' + this.props.equipeNomPhoto)
        this.props.supprimerPhoto2()
    }

    // supprimer la photo 
    supprimerPhoto = () => {
        this.props.supprimerPhoto()
    }

    // sauvegarder equipe 2
    sauvegarderEquipe2 = () => {
        const { equipeNom, equipeFonction } = this.props
        if (!equipeNom && equipeFonction) {
            alert('tous les champs doivent être remplis')
        } else {
            this.props.sauvegarderEquipe()
        }
    }

    render () {
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible = { this.props.afficherFormModal }
                    onRequestClose={() => {
                    }}> 
                    <ScrollView>
                        <TouchableOpacity
                            style={styles.toucheFermerModal}
                            onPress={this.closeFormModal}
                        >
                            <Text style={styles.textToucheFermerModal}>FERMER</Text>
                        </TouchableOpacity>
                        <View style={styles.viewMain}>
                            <TitreRouge
                                titre='Titre'
                            />
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text) => this.changementNom(text)}
                                value={this.props.equipeNom}
                                maxlenght={500}
                            />
                            <Text></Text>
                            <TitreRouge
                                titre='Text'
                            />
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text) => this.changementFonction(text)}
                                value={this.props.equipeFonction}
                                multiline = {true}
                                numberOfLines = {5}
                                maxlenght={5000}
                            />
                            <Text></Text>
                            {this.props.equipeUrlPhotoProvisoire?
                            <TouchableOpacity
                                onPress={this.supprimerPhoto}
                            >
                                <TitreRouge
                                    titre='supprimer la photo'
                                />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={this.selectionPhoto}
                            >
                                <TitreRouge
                                    titre='Choisir une photo'
                                />
                            </TouchableOpacity>
                            }
                            <Text></Text>
                            {this.props.equipeUrlPhotoProvisoire?
                            <View style={styles.contentImage}>
                            <Image
                                style={styles.imageTaille}
                                source={{uri: this.props.equipeUrlPhotoProvisoire}}
                            />
                            </View>
                            :
                            null
                            }
                            <Text></Text>
                            <Button
                                color= 'red'
                                title= 'Sauvegarder'
                                onPress={this.sauvegarderEquipe2}
                            />
                        </View>
                        <View style={{ height: 600 }}/>
                    </ScrollView>
                </Modal> 
            </View>
        )
    }
}

export default EquipeFormModal

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
        paddingLeft: 5,
        paddingRight: 5,
        textAlignVertical: 'top'
    },
    contentImage: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageTaille: {
        width: 100,
        height: 100,
    },
})

