import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { testimonials as testimonialData } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Testimonials() {
    return (
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-card">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Community Says</h2>
                    </div>
                </div>
                <div className="mx-auto grid items-stretch gap-8 sm:max-w-4xl sm:grid-cols-1 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
                    {testimonialData.map((testimonial) => {
                        const avatarImage = PlaceHolderImages.find(p => p.id === testimonial.avatarImageId);
                        return (
                            <Card key={testimonial.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                                <CardContent className="p-6 flex flex-col flex-grow">
                                    <blockquote className="text-lg font-semibold leading-snug flex-grow">
                                       “{testimonial.quote}”
                                    </blockquote>
                                    <div className="mt-6 flex items-center gap-4">
                                        <Avatar>
                                            {avatarImage && (
                                                <AvatarImage src={avatarImage.imageUrl} alt={testimonial.name} data-ai-hint={avatarImage.imageHint}/>
                                            )}
                                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{testimonial.name}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.city}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
