import React, { Component } from 'react'
import { StyleSheet, View, Text, Modal, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import TitreRouge from '../elements/TitreRouge'

class ForumSujetModal extends Component {

    // fermer modal
    bouttonPresser = () => {
        this.props.bouttonPresser()
    }

    // changement sujet
    changementSujet = e => {
        this.props.changementSujet(e)
    }

    // changement message
    changementMessage = e => {
        this.props.changementMessage(e)
    }

    // sauvegarder forum
    sauvegarderForum = () => {
        this.props.sauvegarderForum()
    }

    render () {
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible = { false }
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
                                onChangeText={(text) => this.changementSujet(text)}
                                value={this.props.titre}
                                maxlenght={500}
                            />
                            <Text></Text>
                            <TitreRouge
                                titre='Text'
                            />
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text) => this.changementMessage(text)}
                                value={this.props.text}
                                multiline = {true}
                                numberOfLines = {5}
                                maxlenght={5000}
                            />
                            <Text></Text>
                            <Button
                                color= 'red'
                                title= 'Sauvegarder'
                                onPress={this.sauvegarderForum}
                            />
                        </View>
                        <View style={{ height: 600 }}/>
                    </ScrollView>
                </Modal> 
            </View>
        )
    }
}

export default ForumSujetModal

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


