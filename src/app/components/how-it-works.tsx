"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ListPlus, Search, Send, CheckCircle } from "lucide-react";

const steps = [
    {
        icon: <ListPlus className="size-8 text-primary" />,
        title: "List an Item",
        description: "Upload a photo of your item and tell us what you'd like in exchange. It's fast, free, and easy.",
    },
    {
        icon: <Search className="size-8 text-primary" />,
        title: "Explore & Get Matched",
        description: "Browse items from across Pakistan or check your recommendations for AI-powered swap suggestions.",
    },
    {
        icon: <Send className="size-8 text-primary" />,
        title: "Send a Swap Request",
        description: "Found something you like? Offer one of your own items to start a conversation with the owner.",
    },
    {
        icon: <CheckCircle className="size-8 text-primary" />,
        title: "Meet & Exchange",
        description: "Arrange a safe meeting to exchange your items. Once done, mark the swap as complete on your profile.",
    },
]

const cardColors = [
    "bg-emerald-50",
    "bg-amber-50",
    "bg-sky-50",
    "bg-rose-50",
]

export function HowItWorks() {
    return (
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Four Simple Steps to Swap</h2>
                    </div>
                </div>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full max-w-sm sm:max-w-xl mx-auto"
                >
                    <CarouselContent>
                        {steps.map((step, index) => (
                            <CarouselItem key={index}>
                                 <div className="p-1 h-full">
                                    <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center h-80 w-80 mx-auto ${cardColors[index]} ${index % 2 !== 0 ? 'rounded-full' : ''}`}>
                                        <CardHeader className="flex flex-col items-center text-center gap-4">
                                            <div className="rounded-full bg-background/70 p-4">
                                                {step.icon}
                                            </div>
                                            <CardTitle>{index + 1}. {step.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-center text-muted-foreground flex-1">
                                            {step.description}
                                        </CardContent>
                                    </Card>
                                 </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>
    )
}
