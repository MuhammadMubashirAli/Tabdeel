

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListPlus, Search, Send, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const steps = [
    {
        icon: <ListPlus className="size-8 text-primary" />,
        title: "1. List an Item",
        description: "Upload a photo of your item and tell us what you'd like in exchange. It's fast, free, and easy.",
        image: "https://i.postimg.cc/fTYC23YD/Simple-Minimalist-Typographic-Beauty-Studio-Logo-1.png",
    },
    {
        icon: <Search className="size-8 text-accent" />,
        title: "2. Explore & Get Matched",
        description: "Browse items from across Pakistan or check your recommendations for AI-powered swap suggestions.",
        image: "https://i.postimg.cc/CxCHwWKR/Simple-Minimalist-Typographic-Beauty-Studio-Logo.png",
    },
    {
        icon: <Send className="size-8 text-primary" />,
        title: "3. Send a Swap Request",
        description: "Found something you like? Offer one of your own items to start a conversation with the owner.",
        image: "https://i.postimg.cc/SR36T4xK/Simple-Minimalist-Typographic-Beauty-Studio-Logo-1.png",
    },
    {
        icon: <CheckCircle className="size-8 text-accent" />,
        title: "4. Meet & Exchange",
        description: "Arrange a safe meeting to exchange your items. Once done, mark the swap as complete on your profile.",
        image: "https://i.postimg.cc/wxN4Zxmf/Simple-Minimalist-Typographic-Beauty-Studio-Logo-3.png",
    },
];

export function HowItWorks() {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"],
    });

    const opacityFirst = useTransform(scrollYProgress, [0.1, 0.2, 0.25], [0, 1, 0]);
    const opacitySecond = useTransform(scrollYProgress, [0.3, 0.4, 0.45], [0, 1, 0]);
    const opacityThird = useTransform(scrollYProgress, [0.5, 0.6, 0.65], [0, 1, 0]);
    const opacityFourth = useTransform(scrollYProgress, [0.7, 0.8, 0.9], [0, 1, 1]);
    
    const opacities = [opacityFirst, opacitySecond, opacityThird, opacityFourth];

    return (
        <section ref={targetRef} id="how-it-works" className="w-full relative h-[500vh]">
            <div className="sticky top-0 h-screen bg-black flex flex-col items-center pt-12 overflow-hidden">
                <div className="stars-layer" />
                <div className="container mx-auto px-4 md:px-6 h-full flex flex-col items-center justify-start relative z-10">
                    <div className="w-full text-center pt-10 absolute top-0">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Four Simple Steps to Swap</h2>
                    </div>

                    <div className="absolute top-[30%] w-full h-3/4">
                        <div className="relative w-full h-full flex items-center justify-center">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                style={{ opacity: opacities[index] }}
                                className="absolute w-full max-w-4xl"
                            >
                                <div className="grid md:grid-cols-2 gap-12 items-center">
                                    <div className="space-y-4 text-white">
                                        <h3 className={cn("text-4xl font-bold", index % 2 === 0 ? "text-primary" : "text-accent")}>{step.title}</h3>
                                        <p className="text-lg text-neutral-300">{step.description}</p>
                                    </div>
                                    <div className="relative aspect-square w-full max-w-md mx-auto">
                                        {step.image && (
                                            <Image
                                                src={step.image}
                                                alt={step.title}
                                                fill
                                                className="object-contain rounded-lg"
                                            />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
