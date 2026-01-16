"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConsentModal } from '@/components/legal/ConsentModal';
import { ArrowRight } from 'lucide-react';

export function StartTestFlow() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button
                size="lg"
                className="gap-2 text-base h-12 px-8"
                onClick={() => setIsModalOpen(true)}
            >
                Start Vision Test <ArrowRight className="h-4 w-4" />
            </Button>

            <ConsentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
