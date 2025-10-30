import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { asc, eq, like } from "drizzle-orm";
import { useSQLiteContext } from "expo-sqlite";

import { styles } from "./styles";
import { CustomAlert } from "../components/CustomAlert";
import * as productSchema from "../database/schemas/productSchema";

type Participant = {
  id: number;
  name: string;
};

export function Home() {
  const dbConn = useSQLiteContext();
  const db = drizzle(dbConn, { schema: productSchema });

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantName, setParticipantName] = useState("");
  const [filter, setFilter] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertKind, setAlertKind] = useState<"success" | "error">("success");
  const [alertHeader, setAlertHeader] = useState("");
  const [alertText, setAlertText] = useState("");

  async function getParticipants() {
    try {
      const result = await db.query.product.findMany({
        where: like(productSchema.product.name, `%${filter}%`),
        orderBy: [asc(productSchema.product.name)],
      });
      setParticipants(result);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  }

  async function handleAdd() {
    if (!participantName.trim()) {
      showAlert("error", "Campo obrigatório", "Digite um nome antes de adicionar.");
      return;
    }

    try {
      const inserted = await db.insert(productSchema.product).values({ name: participantName });
      showAlert("success", "Participante adicionado!", `ID: ${inserted.lastInsertRowId}`);
      setParticipantName("");
      getParticipants();
    } catch (err) {
      console.error("Erro ao adicionar:", err);
    }
  }

  async function handleRemove(id: number) {
    try {
      await db.delete(productSchema.product).where(eq(productSchema.product.id, id));
      getParticipants();
      showAlert("error", "Removido", "Participante foi removido da lista.");
    } catch (err) {
      console.error("Erro ao remover:", err);
    }
  }

  function showAlert(type: "success" | "error", title: string, message: string) {
    setAlertKind(type);
    setAlertHeader(title);
    setAlertText(message);
    setAlertVisible(true);
  }

  useEffect(() => {
    getParticipants();
  }, [filter]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Evento de Programação</Text>
        <Text style={styles.subtitle}>Quarta-feira, 29 de Outubro de 2025</Text>
      </View>

      <View style={styles.inputbuttoncontainer}>
        <TextInput
          placeholder="Digite o nome"
          style={styles.input}
          value={participantName}
          onChangeText={setParticipantName}
          placeholderTextColor="gray"
        />
        <TouchableOpacity style={styles.save} onPress={handleAdd}>
          <Text style={styles.buttontext}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Participantes</Text>

      <TextInput
        placeholder="Buscar participante..."
        style={styles.search}
        value={filter}
        onChangeText={setFilter}
        placeholderTextColor="gray"
      />

      {participants.length === 0 && (
        <Text style={styles.defaulttext}>
          Nenhum participante encontrado.{"\n"}Adicione alguém à lista!
        </Text>
      )}

      <FlatList
        data={participants}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ gap: 16 }}
        renderItem={({ item }) => (
          <View style={styles.inputbuttoncontainer}>
            <View style={styles.listitems}>
              <Text style={styles.listtext}>{item.name}</Text>
            </View>

            <TouchableOpacity style={styles.delete} onPress={() => handleRemove(item.id)}>
              <Text style={styles.buttontext}>-</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <CustomAlert
        visible={alertVisible}
        type={alertKind}
        title={alertHeader}
        message={alertText}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}
