import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, View } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "flex flex-row items-center justify-center rounded-xl active:opacity-80",
  variants: {
    variant: {
      primary: "bg-primary",
      secondary: "bg-background-alt",
      outline: "border border-border bg-transparent",
      ghost: "bg-transparent",
    },
    size: {
      sm: "h-10 px-4",
      md: "h-12 px-6",
      lg: "h-14 px-8",
    },
    disabled: {
      true: "opacity-50",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    fullWidth: false,
    disabled: false,
  },
});

const textVariants = tv({
  base: "font-sans font-semibold text-center",
  variants: {
    variant: {
      primary: "text-white",
      secondary: "text-text",
      outline: "text-text",
      ghost: "text-primary",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export interface ButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof buttonVariants> {
  label: string;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  label,
  variant,
  size,
  fullWidth,
  disabled,
  loading,
  icon,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={buttonVariants({ variant, size, fullWidth, disabled: isDisabled, className })}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "white" : "#6671E4"} />
      ) : (
        <View className="flex-row items-center space-x-2">
          {icon}
          <Text className={textVariants({ variant, size })}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
