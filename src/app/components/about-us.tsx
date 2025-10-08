
"use client";

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { motion } from 'framer-motion';
import Autoplay from "embla-carousel-autoplay";

const textContent = [
    "Tabdeel, meaning 'change' or 'exchange' in Urdu, was born from a simple idea: what if we could get the things we need without money? In a world of constant consumption, countless items sit unused in our homes. We believe these items have a second life waiting for them.",
    "Our mission is to build a community-driven marketplace where Pakistanis can swap goods directly. It's about sustainability, reducing waste, and connecting with people. By choosing to barter, you're not just getting something new; you're participating in a circular economy that benefits everyone and the environment."
];

const aboutImages = [
    PlaceHolderImages.find(p => p.id === 'about-us-1'),
    PlaceHolderImages.find(p => p.id === 'about-us-2'),
    PlaceHolderImages.find(p => p.id === 'about-us-3'),
    PlaceHolderImages.find(p => p.id === 'about-us-4'),
].filter(Boolean);


export function AboutUs() {
    const plugin = React.useRef(
        Autoplay({ delay: 1000, stopOnInteraction: true })
    );

    return (
        <section id="about" className="w-full h-screen py-24 md:py-24 lg:py-32 bg-card sticky top-0 z-0">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Rethinking Ownership in Pakistan</h2>
                        </div>
                        <div className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed space-y-4">
                            <p>
                                {textContent[0]}
                            </p>
                            <p>
                                {textContent[1]}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                         <Carousel
                            plugins={[plugin.current]}
                            className="w-full max-w-md mx-auto"
                            onMouseEnter={plugin.current.stop}
                            onMouseLeave={plugin.current.reset}
                            opts={{ loop: true }}
                         >
                            <CarouselContent>
                                {aboutImages.map((image, index) => (
                                    image && (
                                        <CarouselItem key={index}>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 1.5 }}
                                            >
                                                <Card className="overflow-hidden rounded-lg shadow-lg">
                                                    <CardContent className="p-0">
                                                        <div className="relative aspect-[4/3] w-full">
                                                            <Image
                                                                src={image.imageUrl}
                                                                alt={image.description}
                                                                fill
                                                                className="object-cover"
                                                                data-ai-hint={image.imageHint}
                                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                            />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </CarouselItem>
                                    )
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </div>
                </div>
            </div>
        </section>
    );
}
