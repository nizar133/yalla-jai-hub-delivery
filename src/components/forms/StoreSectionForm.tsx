
import { useState } from 'react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { StoreSection } from '@/types';
import { ImageUpload } from '../ImageUpload';

// مخطط التحقق من بيانات القسم
const sectionSchema = z.object({
  name: z.string().min(2, { message: "اسم القسم يجب أن يكون حرفين على الأقل" }),
  coverImage: z.string().min(1, { message: "الرجاء إضافة صورة غلاف للقسم" }),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

interface StoreSectionFormProps {
  storeId: string;
  initialData?: Partial<StoreSection>;
  onSubmit: (data: SectionFormValues & { storeId: string }) => void;
  isLoading?: boolean;
}

export function StoreSectionForm({ storeId, initialData, onSubmit, isLoading = false }: StoreSectionFormProps) {
  const [coverImage, setCoverImage] = useState<string>(initialData?.coverImage || '');

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: initialData?.name || '',
      coverImage: initialData?.coverImage || '',
    }
  });

  const handleSubmit = (values: SectionFormValues) => {
    onSubmit({
      ...values,
      coverImage,
      storeId
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* اسم القسم */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم القسم</FormLabel>
              <FormControl>
                <Input placeholder="اسم القسم" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* صورة غلاف القسم */}
        <FormItem>
          <FormLabel>صورة غلاف القسم</FormLabel>
          <FormControl>
            <ImageUpload 
              value={coverImage} 
              onChange={(url) => {
                setCoverImage(url);
                form.setValue("coverImage", url);
              }}
              disabled={isLoading}
              className="h-40 w-full"
              previewClassName="h-full w-full object-cover"
              label="إضافة صورة غلاف"
            />
          </FormControl>
          <FormMessage>{form.formState.errors.coverImage?.message}</FormMessage>
        </FormItem>

        <Button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground" 
          disabled={isLoading}
        >
          {initialData ? 'تحديث القسم' : 'إضافة قسم جديد'}
        </Button>
      </form>
    </Form>
  );
}
