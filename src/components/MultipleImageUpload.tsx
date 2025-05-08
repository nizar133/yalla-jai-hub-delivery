
import { Button } from "@/components/ui/button";
import { Plus, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MultipleImageUploadProps {
  disabled?: boolean;
  onChange: (urls: string[]) => void;
  values: string[];
  maxImages?: number;
  className?: string;
  imageClassName?: string;
  previewClassName?: string;
  label?: string;
}

export const MultipleImageUpload = ({
  disabled,
  onChange,
  values,
  maxImages = 5,
  className,
  imageClassName,
  previewClassName,
  label = "إضافة صورة"
}: MultipleImageUploadProps) => {
  const [loading, setLoading] = useState(false);

  // في الإنتاج، هنا سيكون رفع الصور الفعلي إلى خدمة مثل Supabase أو AWS S3
  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    if (values.length >= maxImages) {
      alert(`الحد الأقصى للصور هو ${maxImages}`);
      return;
    }

    setLoading(true);

    // للتطوير فقط: استخدم FileReader لتحويل الصورة إلى URL محلي
    const reader = new FileReader();
    reader.onload = (event) => {
      const newUrl = event.target?.result as string;
      onChange([...values, newUrl]);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // إزالة صورة محددة
  const handleRemove = (index: number) => {
    const newUrls = [...values];
    newUrls.splice(index, 1);
    onChange(newUrls);
  };

  return (
    <div className={cn("", className)}>
      {/* عرض الصور الموجودة */}
      {values.map((url, index) => (
        <div 
          key={index} 
          className={cn("relative border rounded-md overflow-hidden", imageClassName)}
        >
          <img
            src={url}
            alt={`صورة ${index + 1}`}
            className={cn("object-contain", previewClassName)}
          />
          <button
            onClick={() => handleRemove(index)}
            className="absolute top-2 left-2 rounded-full bg-destructive p-1 text-white shadow-sm"
            type="button"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}

      {/* زر إضافة صورة جديدة */}
      {values.length < maxImages && (
        <div className={cn("border rounded-md overflow-hidden", imageClassName)}>
          <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-md cursor-pointer hover:bg-muted">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {values.length} / {maxImages}
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              disabled={disabled || loading}
              onChange={onUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};
