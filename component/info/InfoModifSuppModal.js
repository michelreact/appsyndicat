import React, { Component } from 'react'
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native'


class InfoModifSuppModal extends Component {


    // modifier modal
    modifierPresser = () => {
        this.props.modifierPresser()
    }

    // supprimer info
    supprimerPresser = () => {
        this.props.supprimerPresser()
    }

    // modifier info
    modifierPresser = () => {
        this.props.modifierPresser()
    }

    // fermer modal
    bouttonPresser = () => {
        this.props.bouttonPresser()
    }

    render () {
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible = { this.props.afficherModifSuppModal }
                    onRequestClose={() => {
                    }}> 
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={styles.sizeModal}>
                        <TouchableOpacity
                            style={styles.toucheFermerModal}
                            onPress={this.bouttonPresser}
                        >
                            <Text style={styles.textToucheFermerModal}>FERMER</Text>
                        </TouchableOpacity>
                        <View style={styles.viewMain}>
                            <Text style={styles.infoTitre}>{this.props.infoTitre}</Text>
                            <TouchableOpacity onPress={this.modifierPresser}>
                                <Text style={styles.textModal}>MODIFIER</Text>
                            </TouchableOpacity>
                            <Text></Text>
                            <TouchableOpacity onPress={this.supprimerPresser}>
                                <Text style={styles.textModal}>SUPPRIMER</Text>
                            </TouchableOpacity>
                            <Text></Text>
                        </View>
                    </View>
                    </View>
                </Modal> 
            </View>
        )
    }
}

export default InfoModifSuppModal

const styles = StyleSheet.create({
    viewMain: {
    },
    toucheFermerModal: {
        backgroundColor: 'red',
        alignSelf: 'flex-end',
        marginRight: 20,
        marginTop: 10,
    },
    textToucheFermerModal: {
        color:'white',
        textAlign: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
    },
    infoTitre: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
    sizeModal: {
        width: 300,
        height: 150,
        backgroundColor: 'yellow',
        marginLeft: 10,
        marginRight: 10,
    },
    textModal: {
        textAlign: 'center',
        color: 'red',
        fontWeight: 'bold',
    },
})


