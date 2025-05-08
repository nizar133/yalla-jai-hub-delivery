
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
import { Store, StoreCategory, storeCategoryNames } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from '../ImageUpload';

// مخطط التحقق من بيانات المتجر
const storeSchema = z.object({
  name: z.string().min(3, { message: "اسم المتجر يجب أن يكون 3 أحرف على الأقل" }),
  description: z.string().min(10, { message: "وصف المتجر يجب أن يكون 10 أحرف على الأقل" }),
  address: z.string().min(5, { message: "العنوان يجب أن يكون 5 أحرف على الأقل" }),
  category: z.enum(['grocery', 'restaurant', 'other']),
  logo: z.string().min(1, { message: "الرجاء إضافة شعار للمتجر" }),
  coverImage: z.string().min(1, { message: "الرجاء إضافة صورة غلاف للمتجر" }),
});

type StoreFormValues = z.infer<typeof storeSchema>;

interface StoreFormProps {
  initialData?: Partial<Store>;
  onSubmit: (data: StoreFormValues) => void;
  isLoading?: boolean;
}

export function StoreForm({ initialData, onSubmit, isLoading = false }: StoreFormProps) {
  const [logo, setLogo] = useState<string>(initialData?.logo || '');
  const [coverImage, setCoverImage] = useState<string>(initialData?.coverImage || '');

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      address: initialData?.address || '',
      category: initialData?.category || 'grocery',
      logo: initialData?.logo || '',
      coverImage: initialData?.coverImage || '',
    }
  });

  const handleSubmit = (values: StoreFormValues) => {
    onSubmit({
      ...values,
      logo,
      coverImage,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-6 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0">
          {/* اسم المتجر */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المتجر</FormLabel>
                <FormControl>
                  <Input placeholder="اسم المتجر" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* فئة المتجر */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>فئة المتجر</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر فئة المتجر" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(Object.keys(storeCategoryNames) as StoreCategory[]).map((category) => (
                      <SelectItem key={category} value={category}>
                        {storeCategoryNames[category]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* وصف المتجر */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف المتجر</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="وصف مختصر للمتجر ومنتجاته" 
                  {...field} 
                  className="h-24"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* عنوان المتجر */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان المتجر</FormLabel>
              <FormControl>
                <Input placeholder="العنوان التفصيلي للمتجر" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* شعار المتجر */}
        <FormItem>
          <FormLabel>شعار المتجر</FormLabel>
          <FormControl>
            <ImageUpload 
              value={logo} 
              onChange={(url) => {
                setLogo(url);
                form.setValue("logo", url);
              }}
              disabled={isLoading}
              className="h-32 w-32 mx-auto"
              previewClassName="h-full w-full object-cover"
              label="إضافة شعار"
            />
          </FormControl>
          <FormMessage>{form.formState.errors.logo?.message}</FormMessage>
        </FormItem>

        {/* صورة غلاف المتجر */}
        <FormItem>
          <FormLabel>صورة غلاف المتجر</FormLabel>
          <FormControl>
            <ImageUpload 
              value={coverImage} 
              onChange={(url) => {
                setCoverImage(url);
                form.setValue("coverImage", url);
              }}
              disabled={isLoading}
              className="h-48 w-full"
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
          {initialData ? 'تحديث المتجر' : 'إضافة المتجر'}
        </Button>
      </form>
    </Form>
  );
}
