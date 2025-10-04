import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { categories, pakistaniCities } from "@/lib/data"
import { Upload } from "lucide-react"

export default function ListItemPage() {
  return (
    <div className="mx-auto grid max-w-4xl gap-6">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold">List a New Item</h1>
            <p className="text-muted-foreground">Fill out the details below to put your item up for barter.</p>
        </div>
      <Card>
        <CardContent className="p-6">
          <form className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input id="title" type="text" className="w-full" placeholder="e.g. Vintage Leather Cricket Ball" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe your item in detail..." />
            </div>
            <div className="grid gap-3">
              <Label>Upload Photos</Label>
              <div className="flex items-center justify-center w-full">
                  <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                      <Input id="dropzone-file" type="file" className="hidden" multiple />
                  </Label>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                <Label htmlFor="category">Category</Label>
                <Select>
                    <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
                </div>
                <div className="grid gap-3">
                <Label htmlFor="city">City</Label>
                <Select>
                    <SelectTrigger id="city">
                    <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                        {pakistaniCities.map(c => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
                </div>
            </div>
             <div className="grid gap-3">
                <Label>Condition</Label>
                <RadioGroup defaultValue="good" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="like-new" id="r1" />
                        <Label htmlFor="r1">Like New</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="good" id="r2" />
                        <Label htmlFor="r2">Good</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fair" id="r3" />
                        <Label htmlFor="r3">Fair</Label>
                    </div>
                </RadioGroup>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="desiredKeywords">What do you want in exchange? (Keywords)</Label>
              <Input id="desiredKeywords" type="text" className="w-full" placeholder="e.g. Football, gaming chair, headphones" />
              <p className="text-xs text-muted-foreground">List some keywords for items you're interested in.</p>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="desiredCategories">Desired Categories</Label>
               <Select>
                    <SelectTrigger id="desiredCategories">
                    <SelectValue placeholder="Select desired categories (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">This helps our AI find better matches for you.</p>
            </div>
            <Button type="submit" size="lg">List My Item</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
