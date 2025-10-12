
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFirestore, useUser, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { doc, serverTimestamp } from "firebase/firestore";
import { useState, useRef, ChangeEvent, useEffect } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { categories, pakistaniCities } from "@/lib/data";
import type { Item } from "@/lib/types";
import { Camera, Repeat, Trash2 } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.string({ required_error: "Please select a category." }),
  city: z.string({ required_error: "Please select a city." }),
  condition: z.enum(["Like New", "Good", "Fair"]),
  desiredKeywords: z.string().min(3, "Please enter at least one keyword."),
  desiredCategories: z.string().optional(),
});

type EditItemDialogProps = {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditItemDialog({ item, open, onOpenChange }: EditItemDialogProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialImageSource = item.images[0];
  const initialIsDataUri = initialImageSource?.startsWith('data:');
  const initialImageUrl = initialIsDataUri ? initialImageSource : PlaceHolderImages.find(p => p.id === initialImageSource)?.imageUrl;

  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl || null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: item.title,
      description: item.description,
      category: item.category,
      city: item.city,
      condition: item.condition,
      desiredKeywords: item.desiredKeywords,
      desiredCategories: item.desiredCategories[0] || '',
    },
  });
  
  // Reset form and image preview when the item prop changes
  useEffect(() => {
    if (item) {
      form.reset({
        title: item.title,
        description: item.description,
        category: item.category,
        city: item.city,
        condition: item.condition,
        desiredKeywords: item.desiredKeywords,
        desiredCategories: item.desiredCategories[0] || '',
      });
      const newImageSource = item.images[0];
      const newIsDataUri = newImageSource?.startsWith('data:');
      const newImageUrl = newIsDataUri ? newImageSource : PlaceHolderImages.find(p => p.id === newImageSource)?.imageUrl;
      setImagePreview(newImageUrl || null);
    }
  }, [item, form]);


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !user || !item.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to edit an item.",
      });
      return;
    }

    try {
      const itemDocRef = doc(firestore, 'items', item.id);
      
      const updatedData: Partial<Item> & { updatedAt: any } = {
        ...values,
        desiredCategories: values.desiredCategories ? [values.desiredCategories] : [],
        updatedAt: serverTimestamp(),
      };
      
      if (imagePreview) {
        updatedData.images = [imagePreview];
      }

      await updateDocumentNonBlocking(itemDocRef, updatedData);

      toast({
        title: "Item Updated!",
        description: `Your item "${values.title}" has been updated.`,
      });
      onOpenChange(false);

    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem updating your item. Please try again.",
      });
    }
  }

  const handleDelete = async () => {
      if (!firestore || !item.id) return;
      const itemDocRef = doc(firestore, 'items', item.id);
      try {
          await deleteDocumentNonBlocking(itemDocRef);
          toast({
              title: "Item Deleted",
              description: `"${item.title}" has been removed.`,
          });
          onOpenChange(false);
      } catch (error) {
          toast({
            variant: "destructive",
            title: "Delete Failed",
            description: "Could not delete the item. Please try again.",
          });
      }
  }

  const handleMarkAsExchanged = async () => {
    if (!firestore || !item.id) return;
    const itemDocRef = doc(firestore, 'items', item.id);
    try {
        await updateDocumentNonBlocking(itemDocRef, { status: 'exchanged', updatedAt: serverTimestamp() });
        toast({
            title: "Item Exchanged!",
            description: `"${item.title}" has been marked as exchanged.`,
        });
        onOpenChange(false);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not mark the item as exchanged. Please try again.",
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Make changes to your item details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            
            <div className="grid gap-2">
                <Label>Item Photo</Label>
                 {imagePreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                        <Image src={imagePreview} alt="Item preview" fill className="object-cover" />
                        <Button 
                            type="button"
                            variant="secondary"
                            size="icon"
                            className="absolute bottom-2 right-2 rounded-full h-8 w-8"
                            onClick={() => fileInputRef.current?.click()}
                        >
                           <Camera className="h-4 w-4" />
                           <span className="sr-only">Change image</span>
                        </Button>
                         <Input 
                            ref={fileInputRef}
                            id="dropzone-file-edit" 
                            type="file" 
                            className="hidden" 
                            accept="image/png, image/jpeg, image/gif"
                            onChange={handleImageChange}
                        />
                    </div>
                )}
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Vintage Leather Cricket Ball" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your item in detail..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pakistaniCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Condition</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="Like New" />
                        </FormControl>
                        <FormLabel className="font-normal">Like New</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="Good" />
                        </FormControl>
                        <FormLabel className="font-normal">Good</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="Fair" />
                        </FormControl>
                        <FormLabel className="font-normal">Fair</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="desiredKeywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What do you want in exchange? (Keywords)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Football, gaming chair, headphones" {...field} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="desiredCategories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Category (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a desired category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
            <DialogFooter className="pt-4 border-t mt-4 sm:justify-between">
                <div className="flex gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button type="button" variant="destructive">
                                <Trash2 className="mr-2" /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    item listing from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button type="button" variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                                <Repeat className="mr-2" /> Mark as Exchanged
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Mark as Exchanged?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will mark your item as exchanged and remove it from public listings. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleMarkAsExchanged}>Yes, Mark as Exchanged</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="flex gap-2 justify-end mt-4 sm:mt-0">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    