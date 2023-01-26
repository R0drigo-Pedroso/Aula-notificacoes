import * as Notifications from "expo-notifications";

import { useEffect, useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  SafeAreaView,
  Platform,
} from "react-native";

/* Manipulador de eventos de notificação */
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

/* Abaixo esta o components */
export default function App() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    async function permissoesIos() {
      return await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowSound: true,
          allowBadge: true,
          allowAnnouncements: true,
        },
      });
    }

    permissoesIos();

    /* obter as permissões atuais do dispositivo */
    Notifications.getPermissionsAsync().then((status) => {
      if (status.granted) {
        /* Permissões Ok? Então vamos Obter o token expo do aparelho */
        Notifications.getExpoPushTokenAsync().then((token) => {
          console.log(token);
        });
      }
    });

    /* Ouvinte de evento para as respostas dadas ás notificações, ou seja, quando o usuário interage (toca) na notificação */
    Notifications.addNotificationReceivedListener((notificacao) => {
      console.log(notificacao);
    });

    /* Ouvinte de evento para as notificações recebidas, ou seja, quando a notificação aparece no topo da tela do dispositivo */
    Notifications.addNotificationResponseReceivedListener((resposta) => {
      console.log(resposta.notification.request.content.data);
      setDados(resposta.notification.request.content.data);
    });
  }, []);

  const enviarMsg = async () => {
    const mensagem = {
      title: "Lembrete!😆",
      body: "Não se esqueça de tomar água 🥵",
      data: {
        usuario: "Rodrigo 😅",
        cidade: "São Paulo",
      },

      sound: Platform.OS === "ios" ? "defauld" : "",
    };

    /* Função de agendamento de notificações */
    Notifications.scheduleNotificationAsync({
      content: mensagem,
      trigger: { seconds: 5 },
    });
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView style={styles.container}>
        <Text>Exemplo de sistema de notificação local</Text>
        <Button title="Disparar notificação" onPress={enviarMsg} />
        {dados && (
          <View>
            <Text>{dados.usuario}</Text>
            <Text>{dados.cidade}</Text>
          </View>
        )}
        <StatusBar style="auto" />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
