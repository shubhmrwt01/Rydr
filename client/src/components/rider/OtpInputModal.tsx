import { FC, memo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface OtpInputModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  onConfirm: (otp: string) => void;
}

const OtpInputModal: FC<OtpInputModalProps> = ({
  visible,
  onClose,
  title,
  onConfirm,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Move forward
      if (value && index < 3) {
        inputs.current[index + 1]?.focus();
      }

      // Move backward
      if (!value && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleConfirm = () => {
    const otpValue = otp.join("");

    if (otpValue.length === 4) {
      onConfirm(otpValue);
    } else {
      alert("Please enter a valid 4-digit OTP");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        style={styles.overlay}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable style={styles.modalCard}>
            {/* Handle */}
            <View style={styles.handle} />

            {/* Title */}
            <Text style={styles.title}>{title}</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Ask customer for the 4-digit verification code
            </Text>

            {/* OTP Inputs */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  style={[styles.otpInput, digit && styles.activeOtpInput]}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  placeholder="•"
                  placeholderTextColor="#999"
                />
              ))}
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmText}>Verify OTP</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  modalCard: {
    width: "100%",
    backgroundColor: "#121212",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  handle: {
    width: 60,
    height: 5,
    backgroundColor: "#444",
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#A1A1AA",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 35,
    marginBottom: 35,
  },

  otpInput: {
    width: 65,
    height: 70,
    borderRadius: 18,
    backgroundColor: "#1E1E1E",
    borderWidth: 1.5,
    borderColor: "#2A2A2A",
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },

  activeOtpInput: {
    borderColor: "#22C55E",
    backgroundColor: "#18181B",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#232323",
    justifyContent: "center",
    alignItems: "center",
  },

  confirmButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  confirmText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default memo(OtpInputModal);
