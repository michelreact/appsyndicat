import React, { Component } from 'react'
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native'

class InfoSingleModal extends Component {

    // fermer modal
    bouttonPresser = () => {
        this.props.bouttonPresser()
    }

    render () {
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible = { this.props.afficherSingleModal }
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
                            <Text style={styles.infoTitre}>{this.props.infoTitre}</Text>
                            <Text></Text>
                            <Text>{this.props.infoTextarea}</Text>
                        </View>
                    </View>
                </Modal> 
            </View>
        )
    }
}

export default InfoSingleModal

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
    infoTitre:{
        textAlign: 'center',
        fontWeight: 'bold',
    }
})