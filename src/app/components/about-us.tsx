"use client";

import React, { useState } from 'react';

const textContent = [
    "Tabdeel, meaning 'change' or 'exchange' in Urdu, was born from a simple idea: what if we could get the things we need without money? In a world of constant consumption, countless items sit unused in our homes. We believe these items have a second life waiting for them.",
    "Our mission is to build a community-driven marketplace where Pakistanis can swap goods directly. It's about sustainability, reducing waste, and connecting with people. By choosing to barter, you're not just getting something new; you're participating in a circular economy that benefits everyone and the environment."
];

export function AboutUs() {
    const [activeIndex, setActiveIndex] = useState(-1);

    const renderTextWithSpans = (text: string, wordStartIndex: number) => {
        return text.split(' ').map((word, index) => {
            const globalIndex = wordStartIndex + index;
            return (
                <span
                    key={globalIndex}
                    onMouseEnter={() => setActiveIndex(globalIndex)}
                    onMouseLeave={() => setActiveIndex(-1)}
                    className={`transition-transform duration-300 inline-block ${globalIndex === activeIndex ? '-translate-y-1 scale-110 text-primary font-semibold' : ''}`}
                >
                    {word} </span>
            );
        });
    };
    
    return (
        <section id="about" className="w-full py-24 md:py-24 lg:py-32 bg-card">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Rethinking Ownership in Pakistan</h2>
                    </div>
                    <div className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed space-y-4">
                        <p>
                            {renderTextWithSpans(textContent[0], 0)}
                        </p>
                        <p>
                            {renderTextWithSpans(textContent[1], textContent[0].split(' ').length)}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
