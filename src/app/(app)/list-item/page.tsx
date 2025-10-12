
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, serverTimestamp, doc } from "firebase/firestore";
import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/lib/data";
import { Upload, X, Sparkles, Loader2 } from "lucide-react";
import type { Item, User } from "@/lib/types";
import { suggestItemCategoriesAndTags } from "@/ai/flows/suggest-item-categories-and-tags";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.string({ required_error: "Please select a category." }),
  condition: z.enum(["Like New", "Good", "Fair"]),
  desiredKeywords: z.string().min(3, "Please enter at least one keyword."),
  desiredCategories: z.string().optional(),
});

export default function ListItemPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user: authUser } = useUser();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSuggestingCategory, setIsSuggestingCategory] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser]);
  const { data: userProfile } = useDoc<User>(userDocRef);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      condition: "Good",
      desiredKeywords: "",
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        getAiSuggestion(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const getAiSuggestion = async (photoDataUri: string) => {
    const description = form.getValues('description');
    if (!photoDataUri) return;

    setIsSuggestingCategory(true);
    try {
      const result = await suggestItemCategoriesAndTags({
        photoDataUri,
        description: description || 'No description provided yet.',
      });

      if (result && result.category) {
        const matchedCategory = categories.find(c => c.toLowerCase() === result.category.toLowerCase());
        
        if (matchedCategory) {
          form.setValue('category', matchedCategory, { shouldValidate: true });
          toast({
            title: "AI Suggestion",
            description: (
              <div className="flex items-center">
                <Sparkles className="mr-2 text-yellow-400" />
                <span>We've suggested a category for you!</span>
              </div>
            ),
          });
        }
      }
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
      toast({
        variant: "destructive",
        title: "AI Suggestion Failed",
        description: "Could not get an AI suggestion. Please select a category manually.",
      });
    } finally {
      setIsSuggestingCategory(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !authUser || !userProfile) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Could not find user profile. You must be logged in to list an item.",
      });
      return;
    }
    
    if (!imagePreview) {
        toast({
            variant: "destructive",
            title: "Image Required",
            description: "Please upload an image for your item.",
        });
        return;
    }

    try {
      const itemsCollection = collection(firestore, 'items');
      
      const newItem: Omit<Item, 'id' | 'createdAt' | 'updatedAt'> = {
        title: values.title,
        description: values.description,
        images: [imagePreview], 
        category: values.category,
        condition: values.condition,
        city: userProfile.city, // Set city from user's profile
        desiredKeywords: values.desiredKeywords,
        desiredCategories: values.desiredCategories ? [values.desiredCategories] : [],
        status: 'active',
        ownerId: authUser.uid,
      };

      const docData = {
          ...newItem,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
      }

      await addDocumentNonBlocking(itemsCollection, docData);

      toast({
        title: "Success!",
        description: `Your item "${values.title}" has been listed.`,
      });

      router.push('/explore');

    } catch (error) {
      console.error("Error listing item:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem listing your item. Please try again.",
      });
    }
  }


  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">List a New Item</h1>
        <p className="text-muted-foreground">Fill out the details below to put your item up for barter.</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              
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

              <div className="grid gap-3">
                <Label>Upload Photo</Label>
                {imagePreview ? (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                        <Image src={imagePreview} alt="Item preview" fill className="object-cover" />
                        <Button 
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 rounded-full h-8 w-8"
                            onClick={removeImage}
                        >
                           <X className="h-4 w-4" />
                           <span className="sr-only">Remove image</span>
                        </Button>
                    </div>
                ) : (
                    <div 
                        className="flex items-center justify-center w-full"
                        onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary/50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, or GIF</p>
                        </div>
                        <Input 
                            ref={fileInputRef}
                            id="dropzone-file" 
                            type="file" 
                            className="hidden" 
                            accept="image/png, image/jpeg, image/gif"
                            onChange={handleImageChange}
                        />
                      </div>
                    </div>
                )}
              </div>
              
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
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                     {isSuggestingCategory && (
                      <div className="flex items-center text-xs text-muted-foreground">
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          AI is suggesting a category...
                      </div>
                    )}
                    <Select onValueChange={field.onChange} value={field.value} disabled={isSuggestingCategory}>
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
                name="condition"
                render={({ field })=> (
                  <FormItem className="space-y-3">
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
                     <p className="text-xs text-muted-foreground">List some keywords for items you're interested in.</p>
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
                      <p className="text-xs text-muted-foreground">This helps our AI find better matches for you.</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
              <Button type="submit" size="lg" disabled={form.formState.isSubmitting || isSuggestingCategory}>
                {form.formState.isSubmitting ? 'Listing...' : 'List My Item'}
              </Button>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
