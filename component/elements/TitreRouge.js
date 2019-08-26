import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

const TitreRouge = ({ titre }) => (
    <View>
      <Text style={styles.textTitre}>{titre}</Text>
    </View>
)

const styles = StyleSheet.create({
  textTitre: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  }
})

export default TitreRouge