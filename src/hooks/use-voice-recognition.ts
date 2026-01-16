"use client";

import { useEffect, useState, useRef } from 'react';

interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

interface UseVoiceRecognitionProps {
    enabled?: boolean;
    onResult?: (transcript: string) => void;
    onTargetMatch?: (target: string) => void;
    onCommand?: (command: 'CANT_SEE' | 'CAN_SEE') => void;
    targets?: string[]; // The current expected letters/numbers (e.g. ['A', 'B'])
}

export function useVoiceRecognition({
    enabled = true,
    onResult,
    onTargetMatch,
    onCommand,
    targets = []
}: UseVoiceRecognitionProps) {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transcript, setTranscript] = useState('');

    // Refs to keep callbacks fresh without restarting recognition
    const callbacksRef = useRef({ onResult, onTargetMatch, onCommand });
    const targetsRef = useRef(targets);
    const shouldListenRef = useRef(enabled);

    useEffect(() => {
        callbacksRef.current = { onResult, onTargetMatch, onCommand };
        targetsRef.current = targets;
        shouldListenRef.current = enabled;
    }, [onResult, onTargetMatch, onCommand, targets, enabled]);

    useEffect(() => {
        if (typeof window === 'undefined' || !enabled) return;

        const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
        const Recognition = SpeechRecognition || webkitSpeechRecognition;

        if (!Recognition) {
            setError('Browser does not support speech recognition.');
            return;
        }

        const recognition = new Recognition();
        recognition.continuous = true; // Keep listening
        recognition.interimResults = true; // Enable interim results for better feedback
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => {
            setIsListening(false);
            // Auto-restart if it stops but should be enabled
            if (shouldListenRef.current) {
                setTimeout(() => {
                    if (shouldListenRef.current) {
                        try {
                            recognition.start();
                        } catch (e) {
                            console.error("Restart failed", e);
                        }
                    }
                }, 300);
            }
        };
        recognition.onerror = (e: any) => {
            console.error("Speech Err:", e);
            setError(e.error);
        };

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            // Update UI with Current Heading (Interim or Final)
            const currentDisplay = interimTranscript || finalTranscript;
            if (currentDisplay) {
                const text = currentDisplay.trim().toUpperCase();
                setTranscript(text);
                if (callbacksRef.current.onResult) {
                    callbacksRef.current.onResult(text);
                }
            }

            // Process Logic ONLY on Final Results
            if (finalTranscript) {
                const text = finalTranscript.trim().toUpperCase();
                const lowerText = text.toLowerCase();

                // 1. Check strict commands (Negative)
                const NEGATIVE_COMMANDS = ["can't see", "cant see", "cannot see", "skip", "don't see", "not see", "no", "nope", "blurry", "nothing"];
                if (NEGATIVE_COMMANDS.some(cmd => lowerText.includes(cmd))) {
                    if (callbacksRef.current.onCommand) callbacksRef.current.onCommand('CANT_SEE');
                    return;
                }

                // 1.5 Positive Commands
                if (lowerText.includes("can see") || lowerText.includes("clear") || lowerText === "yes" || lowerText === "yeah") {
                    if (callbacksRef.current.onCommand) {
                        callbacksRef.current.onCommand('CAN_SEE');
                    }
                }

                // 2. Check targets with HOMOPHONES
                const currentTargets = targetsRef.current;
                if (currentTargets.length > 0) {
                    const HOMOPHONES: Record<string, string[]> = {
                        'A': ['AY', 'HEY'],
                        'B': ['BEE', 'BE'],
                        'C': ['SEE', 'SEA', 'SI', 'SHE'],
                        'D': ['DEE', 'THE'],
                        'E': ['EE', 'HE'],
                        'F': ['EFF', 'IF'],
                        'G': ['JEE', 'GEE'],
                        'H': ['AITCH', 'HATCH', 'EDGE'],
                        'I': ['EYE', 'AYE', 'HI'],
                        'J': ['JAY'],
                        'K': ['KAY', 'OK', 'OKAY'],
                        'L': ['EL', 'ELL'],
                        'M': ['EM', 'AM'],
                        'N': ['EN', 'AN', 'AND', 'HEN'],
                        'O': ['OH', 'OWE'],
                        'P': ['PEA', 'PEE'],
                        'Q': ['CUE', 'QUEUE'],
                        'R': ['ARE', 'HOUR', 'OUR', 'AH'],
                        'S': ['ESS', 'YES', 'ASS'],
                        'T': ['TEE', 'TEA'],
                        'U': ['YOU', 'EWE'],
                        'V': ['VEE', 'WE'],
                        'W': ['DOUBLE'],
                        'X': ['EX', 'AXE'],
                        'Y': ['WHY', 'WYE'],
                        'Z': ['ZEE', 'ZED', 'SAID'],
                        'YES': ['YEAH', 'YEP', 'SURE', 'OK', 'OKAY', 'FINE', 'GOOD'],
                        'NO': ['NAH', 'NOPE', 'NAY'],
                        'NORMAL': ['SAME', 'ALL', 'CLEAR', 'GOOD'],
                        'SAME': ['NORMAL', 'ALIKE']
                    };

                    const spokenWords = text.split(/[\s,.!?]+/);

                    for (const target of currentTargets) {
                        const upperTarget = target.toUpperCase();
                        const variants = [upperTarget, ...(HOMOPHONES[upperTarget] || [])];

                        const match = variants.some(variant =>
                            spokenWords.includes(variant) || text === variant
                        );

                        if (match) {
                            if (callbacksRef.current.onTargetMatch) {
                                callbacksRef.current.onTargetMatch(upperTarget);
                            }
                            return;
                        }
                    }
                }
            }
        };

        try {
            recognition.start();
        } catch (e) {
            console.error("Failed to start recognition", e);
        }

        return () => {
            recognition.stop();
        };
    }, [enabled]);

    return { isListening, transcript, error };
}
