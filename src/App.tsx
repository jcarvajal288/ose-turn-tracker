import React, {useState} from 'react';
import './App.css';
import {Button, Stack, Typography} from "@mui/material";

type Timer = {
    label: string
    turnsLeft: number
}

const App = () => {

    const [turnCount, setTurnCount] = useState<number>(0);
    const [timers, setTimers] = useState<Timer[]>([]);

    const die = (size: number): number => Math.floor(Math.random() * size) + 1
    const d6 = (): number => die(6)

    const getTimePassed = (): string => {
        const hours = Math.floor(turnCount / 6)
        const minutes = turnCount % 6
        return `${hours}:${minutes}0`
    }

    const addTimer = (label: string, numTurns: number) => {
        const newTimer: Timer = {
            label: label,
            turnsLeft: numTurns
        }
        setTimers(timers.concat([newTimer]))
    }

    const advanceTurn = () => {
        setTurnCount(turnCount + 1)
        const newTimers = timers
            .filter((timer) => timer.turnsLeft > 1)
            .map((timer): Timer => {
                return {label: timer.label, turnsLeft: timer.turnsLeft - 1}
            })
        setTimers(newTimers)
    }


    const turnModulator = (mod: number) => turnCount !== 0 && turnCount % mod === 0

    const isWanderingMonster = (): 'visible' | 'hidden' => turnModulator(2) && d6() <= 1 ? 'visible' : 'hidden'
    const isRestTurn = (): 'visible' | 'hidden' => turnModulator(6) ? 'visible' : 'hidden'

    return (
        <Stack
            alignItems='center'
            gap={2}
        >
            <Stack width='50%' direction='row' justifyContent='space-between'>
                <Typography variant='h3'>{`Turn Count: ${turnCount}`}</Typography>
                <Typography variant='h3'>{`Time passed: ${getTimePassed()}`}</Typography>
            </Stack>
            <Typography variant='h3' visibility={isWanderingMonster}>Wandering Monster</Typography>
            <Typography variant='h3' visibility={isRestTurn}>Rest Turn</Typography>
            <Stack
                width='50%'
                direction='row'
                justifyContent='space-around'
            >
                {
                    timers.map((timer) => (
                        <Typography variant='h5'>{`${timer.label}: ${timer.turnsLeft}`}</Typography>
                    ))
                }
            </Stack>
            <Button
                variant='contained'
                onClick={advanceTurn}
            >
                Next Turn
            </Button>
            <Stack direction='row' gap={4}>
                <Button onClick={() => addTimer('Torch', 6)}>
                    Add Torch
                </Button>
                <Button onClick={() => addTimer('Lantern', 24)}>
                    Add Lantern
                </Button>
            </Stack>
        </Stack>
    );
};

export default App;
