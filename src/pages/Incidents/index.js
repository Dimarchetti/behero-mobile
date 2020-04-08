import React, { useState, useEffect } from 'react'
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'

import logoImg from '../../assets/logo.png'

import api from '../../services/api'
import styles from './styles'

// Fazer a página: primeiro a estrutura, depois a estilização e por último deixar a página dinâmica


export default function Incidents() {
  // Aqui está sendo usado um array vazio dentro do estado pq como a resposta será um array, é sempre bom o array já estar inicializado e vazio.
  const [incidents, setIncidents] = useState([])
  // Aqui está sendo inicializado com zero pq nós pegaremos um valor numerico
  const [total, setTotal] = useState(0)

  const[page, setPage] = useState(1)
  const[loading, setLoading] = useState(false)

  // Parecido com o useHistory do React
  const navigation = useNavigation()

  // faz a navegação e manda incident como parâmetro para a página Detail
  function navigateToDetail(incident) {
    navigation.navigate('Detail', { incident })
  }

  // Função chamando o setIncidents com os dados da api no (response.data)
  async function loadIncidents() {
    if (loading) {
      return
    }

    if (total > 0 && incidents.length === total) {
      return
    }
    setLoading(true)


    const response = await api.get('incidents', {
      params: { page }
    })

    // Colocando 2 vetores dentro de 1
    setIncidents([...incidents, ...response.data])
    setTotal(response.headers['x-total-count'])
    setPage(page + 1)
    setLoading(false)
  }

  useEffect(() => {
    loadIncidents()
  }, [])

  return(
    //Cabeçalho
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />
        <Text>
          Total de <Text style={styles.headerTextBold}>{total} casos</Text>.
        </Text>
      </View>
      <Text style={styles.title}>Bem Vindo!</Text>
      <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>
      
      <FlatList // Corpo da página
        // pegando incidents
        data={incidents}
        style={styles.incidentList} 
        // Pegando id dos incidents
        keyExtractor={incident => String(incident.id)}
        showsVerticalScrollIndicator={true}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.2}
        // transforma variável item em incident
        renderItem={({ item: incident }) => (
        
          <View style={styles.incident}>
            <Text style={[styles.incidentProperty, { marginTop: 0 }]}>ONG:</Text>
        <Text style={styles.incidentValue}>{incident.name} de {incident.city}/{incident.uf}</Text>

            <Text style={styles.incidentProperty}>Caso:</Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>
            
            <Text style={styles.incidentProperty}>Valor:</Text>
            <Text style={styles.incidentValue}>{Intl.NumberFormat('pt-BR',{ 
              style: 'currency',
              currency: 'BRL' }).format(incident.value)}</Text>

          <TouchableOpacity
            style={styles.detailsButton}
            // enviando dados de incident como paâmetro para outra página
            onPress={() => navigateToDetail(incident)}
          >
            <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
            <Feather name="arrow-right" size={16} color="#e02041" />
          </TouchableOpacity>
        </View>
        )}
      />
    </View>
  )
}