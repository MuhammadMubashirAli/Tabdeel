"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListPlus, Search, Send, CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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
        description: "Found something you like? Offer one or more of your own items to start a conversation with the owner.",
    },
    {
        icon: <CheckCircle className="size-8 text-primary" />,
        title: "Meet & Exchange",
        description: "Arrange a safe meeting to exchange your items. Once done, mark the swap as complete on your profile.",
    },
]

export function HowItWorks() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: "0px",
                threshold: 0.1
            }
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 overflow-x-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Four Simple Steps to Swap</h2>
                    </div>
                </div>
                <div className="mx-auto grid items-stretch gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <Card key={index} className={cn(
                            "shadow-lg hover:shadow-xl transition-all duration-700 ease-out flex flex-col transform",
                            isVisible ? "opacity-100 translate-x-0" : "opacity-0",
                            index < 2 ? "-translate-x-full" : "translate-x-full",
                            `delay-[${index * 150}ms]`
                        )}>
                            <CardHeader className="flex flex-col items-center text-center gap-4">
                                <div className="rounded-full bg-secondary p-4">
                                    {step.icon}
                                </div>
                                <CardTitle>{index + 1}. {step.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-muted-foreground flex-1">
                                {step.description}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
