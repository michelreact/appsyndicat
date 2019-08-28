import React, { Component } from 'react'
import { StyleSheet, View, Text, Modal, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import TitreRouge from '../elements/TitreRouge'

class InfoFormModal extends Component {

    // fermer modal
    bouttonPresser = () => {
        this.props.bouttonPresser()
    }

    // changement titre
    changementTitre = e => {
        this.props.changementTitre(e)
    }

    // changement text area
    changementTextarea = e => {
        this.props.changementTextarea(e)
    }

    // sauvegarder info
    bouttonSauvegarderInfo = () => {
        const { infoTitre, infoTextarea, infoId } = this.props
        if (!infoTitre && infoTextarea) {
            alert('tous les champs doivent être remplis')
        } else {
            this.props.sauvegarderInfo()
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
                    <ScrollView keyboardShouldPersistTaps = "always">
                        <TouchableOpacity
                            style={styles.toucheFermerModal}
                            onPress={this.bouttonPresser}
                        >
                            <Text style={styles.textToucheFermerModal}>FERMER</Text>
                        </TouchableOpacity>
                        <View style={styles.viewMain}>
                            <TitreRouge
                                titre='Titre'
                            />
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text) => this.changementTitre(text)}
                                value={this.props.titre}
                                maxlenght={500}
                            />
                            <Text></Text>
                            <TitreRouge
                                titre='Text'
                            />
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text) => this.changementTextarea(text)}
                                value={this.props.text}
                                multiline = {true}
                                numberOfLines = {15}
                                maxlenght={5000}
                            />
                            <Text></Text>
                            <Button
                                color= 'red'
                                title= 'Sauvegarder'
                                onPress={this.bouttonSauvegarderInfo}
                            />
                        </View>
                        <View style={{ height: 600 }}/>
                    </ScrollView>
                </Modal> 
            </View>
        )
    }
}

export default InfoFormModal

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
})



