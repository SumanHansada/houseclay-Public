import { Loader2 } from "lucide-react";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Content props
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  // Style variants
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "custom";

  // State props
  isLoading?: boolean;
  isFullWidth?: boolean;
  isDisabled?: boolean;

  // Styling props
  className?: string;
  iconClassName?: string;
  loaderClassName?: string;
  buttonTextClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  leftIcon,
  rightIcon,
  variant = "primary",
  size = "md",
  isLoading = false,
  isFullWidth = false,
  isDisabled = false,
  className = "",
  iconClassName = "",
  loaderClassName = "",
  buttonTextClassName = "",
  type = "button",
  ...props
}) => {
  // Base styles
  const baseStyles = "inline-flex items-center justify-center";

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    custom: "text-base",
  };

  // Variant styles
  const variantStyles = {
    primary: "bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white",
    secondary:
      "bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 text-gray-900",
    outline:
      "border border-gray-300  hover:bg-gray-50 focus:ring-gray-500 text-gray-600",
    ghost: " hover:bg-gray-100 focus:ring-gray-500 text-gray-600",
    danger: "bg-red-600  hover:bg-red-600 focus:ring-red-500 text-white",
  };

  // Width styles
  const widthStyles = isFullWidth ? "w-full" : "";

  // Icon spacing styles
  const iconSpacing = "gap-2";

  // Combine all styles
  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${iconSpacing} ${className}`;

  const iconStyles = `${iconClassName}`;
  const loaderStyles = `animate-spin ${loaderClassName}`;

  return (
    <button
      type={type}
      className={buttonStyles}
      disabled={isDisabled || isLoading}
      aria-disabled={isDisabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className={loaderStyles} aria-hidden="true" />
      ) : (
        <>
          {leftIcon && (
            <span className={iconStyles} aria-hidden="true">
              {leftIcon}
            </span>
          )}
          <span className={buttonTextClassName}>{children}</span>
          {rightIcon && (
            <span className={iconStyles} aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
