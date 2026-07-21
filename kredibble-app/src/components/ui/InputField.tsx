import React, { useState } from "react";
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

export interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export function InputField({
  label,
  error,
  isPassword,
  className,
  ...props
}: InputFieldProps) {
  const [isSecure, setIsSecure] = useState(isPassword);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`w-full mb-4 ${className || ""}`}>
      {label && (
        <Text className="text-sm font-sans font-medium text-text mb-2">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center h-14 bg-background-card border rounded-xl px-4 ${
          error
            ? "border-error"
            : isFocused
            ? "border-primary"
            : "border-border"
        }`}
      >
        <TextInput
          className="flex-1 font-sans text-base text-text h-full"
          placeholderTextColor="#A1A1AA"
          secureTextEntry={isSecure}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsSecure(!isSecure)}
            className="ml-2 p-1"
          >
            {isSecure ? (
              <EyeOff size={20} color="#A1A1AA" />
            ) : (
              <Eye size={20} color="#A1A1AA" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-xs font-sans text-error mt-1">{error}</Text>
      )}
    </View>
  );
}
