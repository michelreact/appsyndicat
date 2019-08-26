import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    } from 'react-native'

import { WebView } from 'react-native-webview'
import TitreRouge from '../elements/TitreRouge'

class TractModalPdf extends Component {

    // fermer modal
    fermerModalPdf = () => {
        this.props.fermerModalPdf()
    }

    render () {
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible = { this.props.afficherModalPdf }
                    onRequestClose={() => {
                    }}> 
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={styles.sizeModal}>
                        <TouchableOpacity
                            style={styles.toucheFermerModal}
                            onPress={this.fermerModalPdf}
                        >
                            <Text style={styles.textToucheFermerModal}>FERMER</Text>
                        </TouchableOpacity>
                        <View style={styles.viewMain}>
                            <TitreRouge titre='telechargement'/>
                            <WebView
                                source={{uri: this.props.tractModalUrl}}
                                style={{ marginTop: 20 }}
                            />
                        </View>
                    </View>
                    </View>
                </Modal> 
            </View>
        )
    }
}

export default TractModalPdf

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
