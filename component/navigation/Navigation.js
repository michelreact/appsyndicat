import { createStackNavigator, createAppContainer } from 'react-navigation'
import Home from '../home/Home'
import Connexion from '../authentification/Connexion'
import Tract from '../tract/Tract'
import Info from '../info/Info'
import Equipe from '../equipe/Equipe'
import Contact from '../contact/Contact'
import Forum from '../forum/Forum'
import Param from '../param/Param'
import Usagers from '../param/Usagers'

const SearchStackNavigation = createStackNavigator({

    Home: {
        screen: Home,
        navigationOptions: { 
            header: null }
    },

    Connexion: { 
        screen: Connexion,
        navigationOptions: {
        title: 'Connexion',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'red',
          },
          headerTitleStyle: {
            color: 'white'
          }
        }
    },

    Tract: { 
        screen: Tract,
        navigationOptions: {
        title: 'Tract',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'red',
          },
          headerTitleStyle: {
            color: 'white'
          }
        }
    },

    Info: { 
        screen: Info,
        navigationOptions: {
        title: 'Infos pratiques',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'red',
          },
          headerTitleStyle: {
            color: 'white'
          }
        }
    },

    Equipe: { 
        screen: Equipe,
        navigationOptions: {
        title: 'Equipe',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'red',
          },
          headerTitleStyle: {
            color: 'white'
          }
        }
    },

    Contact: { 
        screen: Contact,
        navigationOptions: {
        title: 'Contact',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'red',
          },
          headerTitleStyle: {
            color: 'white'
          }
        }
    },

    Forum: { 
        screen: Forum,
        navigationOptions: {
        title: 'Forum',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'red',
          },
          headerTitleStyle: {
            color: 'white'
          }
        }
      },

      Param: { 
        screen: Param,
        navigationOptions: {
        title: 'Param',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'red',
          },
          headerTitleStyle: {
            color: 'white'
          }
        }
      },
    
      Usagers: { 
        screen: Usagers,
        navigationOptions: {
        title: 'Usagers',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'red',
          },
          headerTitleStyle: {
            color: 'white'
          }
        }
      },
})

export default createAppContainer(SearchStackNavigation)
