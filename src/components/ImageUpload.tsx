
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (url: string) => void;
  onRemove?: () => void;
  value?: string;
  className?: string;
  previewClassName?: string;
  label?: string;
}

export const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
  className,
  previewClassName,
  label = "إضافة صورة"
}: ImageUploadProps) => {
  const [loading, setLoading] = useState(false);

  // في الإنتاج، هنا سيكون رفع الصور الفعلي إلى خدمة مثل Supabase أو AWS S3
  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setLoading(true);

    // للتطوير فقط: استخدم FileReader لتحويل الصورة إلى URL محلي
    const reader = new FileReader();
    reader.onload = (event) => {
      onChange(event.target?.result as string);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // تنظيف URL للصورة
  const handleRemove = () => {
    onChange("");
    if (onRemove) onRemove();
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="w-full relative border rounded-md overflow-hidden">
        {value ? (
          <div className="relative aspect-square w-full">
            <img
              src={value}
              alt="المرفق"
              className={cn("object-contain", previewClassName)}
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 left-2 rounded-full bg-destructive p-1 text-white shadow-sm"
              type="button"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-md cursor-pointer hover:bg-muted">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
            <input
              type="file"
              accept="image/*"
              disabled={disabled || loading}
              onChange={onUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};
