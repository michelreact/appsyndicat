import React, { Component } from 'react'
import { View, Text, Button, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native'
// firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { auth } from '../base/base'
// elements
import TitreRouge from '../elements/TitreRouge'

export default class Connexion extends Component {
    state = {
        // base usagers
        usagers: '',
        prenom: '',
        nom: '',
        telephone: '',
        mail: '',
        motDePasse: '',
        adresse: '',
        // connexion
        connecter: false,
        seConnecter: false,
        creerUnCompte: false,
        // redirection 
        redirectionHome: false,
    }

    // si connecté ?
    componentDidMount () {
        auth.onAuthStateChanged(user => {
            if (user) {
              this.setState({ connecter:true })
            } else {
                this.setState({ connecter: false })
            }
        })
    }

    // afficher input se connecter
    bouttonAfficherSeConnecter = () => {
        const { seConnecter, mail, motDePasse } = this.state
        // si les inputs sont deja afficher fermer les inputs
        if (seConnecter) {
            this.setState({ seConnecter:false })
        } else {
            // si les inputs creer un compte sont affichés les fermer
            this.setState({ seConnecter:true, creerUnCompte:false })
        }
    }

    // afficher input creer un compte
    bouttonAfficherCreerCompte = () => {
        const { creerUnCompte } = this.state
        // si les inputs sont deja afficher fermer les inputs
        if (creerUnCompte) {
            this.setState({ creerUnCompte:false })
        } else {
            this.setState({ creerUnCompte:true, seConnecter:false })
        }
    }

    // connexion
    bouttonConnexion = () => {
        const { mail, motDePasse } = this.state
        // si connecter est deja afficher
        return new Promise(
            (resolve, reject) => {
              auth.signInWithEmailAndPassword(mail.trim(), motDePasse).then(
                () => {
                  resolve();
                    alert('tu es maintenant connecter')
                    this.setState({ connecter:true, seConnecter:false, email: '', motDePasse: '', redirectionHome: true })
                },
                (error) => {
                  reject(error);
                  alert('connexion impossible')
                }
              );
            }
        );
    }

    // creer compte
    bouttonCreerCompte = () => {
        const usagers = { ...this.state.usagers }
        const { prenom, nom, telephone, mail, motDePasse } = this.state
        if (prenom && nom && mail && motDePasse) {
        return new Promise(
            (resolve, reject) => {
            // creation et sauvegarde du compte usager
              auth.createUserWithEmailAndPassword(mail.trim(), motDePasse)
                .then(() => {
                    firebase.auth().onAuthStateChanged((user) => {
                        if (user) {
                            resolve();
                            alert('tu es maintenant connecté')
                            // sauvegarder les informations de l'usager dans la base de donnée
                            firebase.database().ref('web3/usagers/'+user.uid).set({
                                id: user.uid,
                                prenom: prenom,
                                nom: nom.toUpperCase(),
                                telephone: telephone,
                                mail: mail,
                                motdepasse: motDePasse,
                                adherent: false,
                                elu: false,
                                admin: false,
                            })
                            this.setState({ connecter:true, creerUnCompte:false, prenom: '', nom: '', telephone: '', mail: '', motDePasse: '', redirectionHome: true })
                            // creer un compte dans la database
                        }
                    });
                },
                (error) => {
                  reject(error);
                  alert('impossible de se connecter'+ error)
                }
              );
            }
        );
        } else {
            alert('tous les champs ne sont pas remplis')
        }
    }

    // boutton test
    bouttonPasswordOublier = () => {
        firebase.auth().sendPasswordResetEmail(this.state.mail)
            .then(
                () => {
                    alert('vas sur ta messagerie pour ton nouveau mot de passe')
                },
                (error) => {
                    alert('renseigne ton email')
                }
            );
    }

    // se deconnecter
    bouttonDeconnection = () => {
        auth.signOut()
    }


    render() {
        const { seConnecter, mail, motDePasse, connecter, creerUnCompte, prenom, nom, telephone, adresse, redirectionHome } = this.state
        // redirection
        if (redirectionHome) {
            this.props.navigation.navigate('Home')
        }

        if (connecter) {
            // BOUTTON DECONNECTION
            return(
                <View style={styles.container}>
                    <Text></Text>
                    <Text></Text>
                    <Button
                        title='deconnexion'
                        color='red'
                        onPress={this.bouttonDeconnection}
                    />
                </View>
            )
        }

        return(
            <ScrollView style={styles.container} keyboardShouldPersistTaps = "always">
                <Text></Text>
                <Text></Text>
                {/* SE CONNECTER */}
                <Button
                    title='se connecter'
                    color='red'
                    onPress={this.bouttonAfficherSeConnecter}
                />
                {seConnecter?
                <View>
                    <TitreRouge titre='mail'/>
                    <View style={styles.inputContainer}>
                        {/* mail */}
                        <TextInput
                            style={styles.input}
                            onChangeText={(mail) => this.setState({mail})}
                            value={mail}
                        />
                    </View> 
                    <TitreRouge titre='mot de passe'/>
                    <View style={styles.inputContainer}>
                        {/* mot de passe */}
                        <TextInput
                            style={styles.input}
                            onChangeText={(motDePasse) => this.setState({motDePasse})}
                            value={motDePasse}
                        />
                    </View> 
                    <Text></Text>
                    <Button
                        title='valider'
                        color='red'
                        onPress={this.bouttonConnexion}
                    />
                    <Text></Text>
                    <Button
                        title='mot de passe oublié'
                        color='green'
                        onPress={this.bouttonPasswordOublier}
                    />
                </View>
                :null}
                <Text></Text>
                <Text></Text>
                <Button
                    title='creer un compte'
                    color='red'
                    onPress={this.bouttonAfficherCreerCompte}
                />
                {/* CREER UN COMPTE */}
                {creerUnCompte?
                <View>
                    <TitreRouge titre='prenom'/>
                    <View style={styles.inputContainer}>
                        {/* prenom */}
                        <TextInput
                            style={styles.input}
                            onChangeText={(prenom) => this.setState({prenom})}
                            value={prenom}
                        />
                    </View> 
                    <TitreRouge titre='nom'/>
                    <View style={styles.inputContainer}>
                        {/* nom */}
                        <TextInput
                            style={styles.input}
                            onChangeText={(nom) => this.setState({nom})}
                            value={nom}
                        />
                    </View>
                    <TitreRouge titre='telephone'/>
                    <View style={styles.inputContainer}>
                        {/* telephone */}
                        <TextInput
                            style={styles.input}
                            onChangeText={(telephone) => this.setState({telephone})}
                            value={telephone}
                        />
                    </View>
                    <TitreRouge titre='mail'/>
                    <View style={styles.inputContainer}>
                        {/* mail */}
                        <TextInput
                            style={styles.input}
                            onChangeText={(mail) => this.setState({mail})}
                            value={mail}
                        />
                    </View>
                    <TitreRouge titre='mot de passe'/>
                    <View style={styles.inputContainer}>
                        {/* prenom */}
                        <TextInput
                            style={styles.input}
                            onChangeText={(motDePasse) => this.setState({motDePasse})}
                            value={motDePasse}
                        />
                    </View>
                    <TitreRouge titre='adresse'/>
                    <View style={styles.inputContainer}>
                        {/* prenom */}
                        <TextInput
                            style={styles.input}
                            onChangeText={(adresse) => this.setState({adresse})}
                            value={adresse}
                            multiline = {true}
                            numberOfLines = {4}
                            maxlenght={500}
                        />
                    </View>
                    <Text></Text>
                    <Button
                        title='valider'
                        color='red'
                        onPress={this.bouttonCreerCompte}
                    />
                </View>
                :null}
                <View style={{ height: 600 }} />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 30,
        marginRight: 30,
    },
    inputContainer: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: 'yellow',
    },
    input: {
        paddingLeft: 5,
    },
})
