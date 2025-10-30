import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type AlertProps = {
  visible: boolean;
  type?: "success" | "error";
  title: string;
  message?: string;
  onClose: () => void;
};

export function CustomAlertBox({
  visible,
  type = "success",
  title,
  message,
  onClose,
}: AlertProps) {
  const success = type === "success";

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.background}>
        <View style={styles.card}>
          <Ionicons
            name={success ? "checkmark-circle-outline" : "alert-circle-outline"}
            size={65}
            color={success ? "#3DDC84" : "#F44336"}
            style={{ marginBottom: 12 }}
          />

          <Text style={styles.heading}>{title}</Text>

          {message ? <Text style={styles.body}>{message}</Text> : null}

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: success ? "#3DDC84" : "#F44336" },
            ]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonLabel}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "78%",
    backgroundColor: "#252836",
    borderRadius: 18,
    padding: 26,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
  heading: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  body: {
    fontSize: 16,
    color: "#CFCFCF",
    textAlign: "center",
    marginBottom: 18,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
