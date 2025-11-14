import { useField, useFormikContext } from "formik";
import { CircleX, Plus } from "lucide-react";
import { useRef } from "react";

import { AddAdminFormValues } from "../page";

export const DocumentUpload: React.FC<{
  label: string;
  fieldName: "pan" | "aadhaar";
}> = ({ label, fieldName }) => {
  const { setFieldValue } = useFormikContext<AddAdminFormValues>();
  const [field, meta] = useField<File | null>(`documents.${fieldName}`);
  const file = field.value as File | null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full">
      <p className="mb-2 text-sm font-medium text-gray-700">{label}</p>

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          id={fieldName}
          name={field.name}
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) =>
            setFieldValue(field.name, e.currentTarget.files?.[0] ?? null, true)
          }
        />

        <label
          htmlFor={fieldName}
          className="w-10 h-10 flex items-center justify-center border border-dashed rounded-lg cursor-pointer"
        >
          <Plus size={18} />
        </label>

        {file && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600 underline truncate max-w-xs">
              {file.name}
            </span>
            <button
              type="button"
              onClick={() => {
                setFieldValue(field.name, null, true);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              <CircleX size={18} />
            </button>
          </div>
        )}
      </div>

      {meta.touched && typeof meta.error === "string" && (
        <p className="text-red-600 text-sm mt-1">{meta.error}</p>
      )}
    </div>
  );
};
