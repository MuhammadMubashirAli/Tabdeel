"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListPlus, Search, Send, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
    {
        icon: <ListPlus className="size-8 text-primary" />,
        title: "1. List an Item",
        description: "Upload a photo of your item and tell us what you'd like in exchange. It's fast, free, and easy.",
    },
    {
        icon: <Search className="size-8 text-accent" />,
        title: "2. Explore & Get Matched",
        description: "Browse items from across Pakistan or check your recommendations for AI-powered swap suggestions.",
    },
    {
        icon: <Send className="size-8 text-primary" />,
        title: "3. Send a Swap Request",
        description: "Found something you like? Offer one of your own items to start a conversation with the owner.",
    },
    {
        icon: <CheckCircle className="size-8 text-accent" />,
        title: "4. Meet & Exchange",
        description: "Arrange a safe meeting to exchange your items. Once done, mark the swap as complete on your profile.",
    },
];

export function HowItWorks() {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"],
    });

    const stepOpacities = [
        useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1, 0]),
        useTransform(scrollYProgress, [0.25, 0.45, 0.5], [0, 1, 0]),
        useTransform(scrollYProgress, [0.5, 0.7, 0.75], [0, 1, 0]),
        useTransform(scrollYProgress, [0.75, 0.95, 1], [0, 1, 1]),
    ];

    return (
        <section ref={targetRef} id="how-it-works" className="w-full sticky top-0 overflow-hidden h-screen bg-black stars-bg">
            <div className="stars-layer" />
            <div className="container mx-auto px-4 md:px-6 h-full flex flex-col justify-center relative z-10">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Four Simple Steps to Swap</h2>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center relative">
                    {steps.map((step, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <motion.div
                                key={index}
                                style={{ opacity: stepOpacities[index] }}
                                className="absolute"
                            >
                                <Card className={cn(
                                    "shadow-lg flex flex-col items-center justify-center h-80 w-80 backdrop-blur-sm border border-white/10",
                                    isEven ? 'bg-primary/20' : 'bg-accent/20'
                                )}>
                                    <CardHeader className="flex flex-col items-center text-center gap-4">
                                        <div className="rounded-full bg-background/70 p-4">
                                            {step.icon}
                                        </div>
                                        <CardTitle>{step.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center text-muted-foreground flex-1 px-6">
                                        {step.description}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
