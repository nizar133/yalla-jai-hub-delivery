
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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product, StoreSection } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MultipleImageUpload } from '../MultipleImageUpload';

// مخطط التحقق من بيانات المنتج
const productSchema = z.object({
  name: z.string().min(2, { message: "اسم المنتج يجب أن يكون حرفين على الأقل" }),
  description: z.string().min(10, { message: "وصف المنتج يجب أن يكون 10 أحرف على الأقل" }),
  price: z.coerce.number().positive({ message: "السعر يجب أن يكون رقماً موجباً" }),
  sectionId: z.string().min(1, { message: "الرجاء اختيار قسم للمنتج" }),
  available: z.boolean().default(true),
  images: z.array(z.string()).min(1, { message: "الرجاء إضافة صورة واحدة على الأقل" }).max(5, { message: "الحد الأقصى 5 صور" }),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  storeId: string;
  sections: StoreSection[];
  initialData?: Partial<Product>;
  onSubmit: (data: ProductFormValues & { storeId: string }) => void;
  isLoading?: boolean;
}

export function ProductForm({ storeId, sections, initialData, onSubmit, isLoading = false }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      sectionId: initialData?.sectionId || '',
      available: initialData?.available !== undefined ? initialData.available : true,
      images: initialData?.images || [],
    }
  });

  const handleSubmit = (values: ProductFormValues) => {
    onSubmit({
      ...values,
      images,
      storeId
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-6 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0">
          {/* اسم المنتج */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المنتج</FormLabel>
                <FormControl>
                  <Input placeholder="اسم المنتج" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* سعر المنتج */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>السعر (ر.س)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="سعر المنتج" 
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* وصف المنتج */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف المنتج</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="وصف تفصيلي للمنتج" 
                  {...field} 
                  className="h-24"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* قسم المنتج */}
        <FormField
          control={form.control}
          name="sectionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>القسم</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر قسم المنتج" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* توفر المنتج */}
        <FormField
          control={form.control}
          name="available"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">متوفر للبيع</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* صور المنتج */}
        <FormItem>
          <FormLabel>صور المنتج (من 1 إلى 5 صور)</FormLabel>
          <FormControl>
            <MultipleImageUpload 
              values={images} 
              onChange={(urls) => {
                setImages(urls);
                form.setValue("images", urls);
              }}
              maxImages={5}
              disabled={isLoading}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              imageClassName="h-40 w-full"
              previewClassName="h-full w-full object-cover"
              label="إضافة صورة"
            />
          </FormControl>
          <FormMessage>{form.formState.errors.images?.message}</FormMessage>
        </FormItem>

        <Button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground" 
          disabled={isLoading}
        >
          {initialData ? 'تحديث المنتج' : 'إضافة منتج جديد'}
        </Button>
      </form>
    </Form>
  );
}
